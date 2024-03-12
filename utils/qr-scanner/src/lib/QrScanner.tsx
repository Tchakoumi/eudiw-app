import { BrowserMultiFormatReader, Exception, Result } from '@zxing/library';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IQrScannerProps } from './qrScannerProps';
import { Loading } from './Loading';

export function QrScanner<T = unknown>(props: IQrScannerProps<T>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());

  const [error, setError] = useState<Exception | null>(null);

  const handleDecodeError = useCallback(
    (error: Exception) => {
      let customErrorMessage: string | null = null;
      if (props.onError) {
        const errorMessage = props.onError(error);
        if (typeof errorMessage === 'string') customErrorMessage = errorMessage;
      } else console.warn('QrScanner: Unhandled exception!');
      setError(
        customErrorMessage !== null ? new Exception(customErrorMessage) : error
      );
    },
    [props]
  );

  const getQrData = useCallback(
    (result: Result) => {
      try {
        let data: T;
        try {
          data = JSON.parse(result.getText());
        } catch (error) {
          return props.validate
            ? props.validate(result.getText())
            : (result.getText() as T);
        }
        return props.validate ? props.validate(data) : data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (!!error && typeof error.message == 'string')
          throw new Exception(error.message);
        throw new Exception('Unknown error');
      }
    },
    [props]
  );

  useEffect(() => {
    if (!videoRef.current) return;
    reader.current.timeBetweenDecodingAttempts = props.scanDelay ?? 500;
    reader.current
      .decodeFromConstraints(
        {
          audio: false,
          video: {
            facingMode: props.facingMode || 'environment',
          },
        },
        videoRef.current,
        (result, error) => {
          if (result) {
            props.onResult(getQrData(result), result);
            setError(null);
          } else if (error) handleDecodeError(error);
        }
      )
      .catch(handleDecodeError);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      reader.current.reset();
    };
  }, [getQrData, handleDecodeError, props, videoRef]);
  if (props.children) return <>{props.children(videoRef)}</>;

  const scanImageNotfoundErrors = ['NotFoundException', 't'];

  return (
    <div
      style={{
        borderColor: 'rgb(147 197 253)',
        borderWidth: '4px',
        width: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
      }}
    >
      {error && (
        <div
          style={{
            color: scanImageNotfoundErrors.includes(error.name)
              ? 'inherit'
              : 'red',
            textAlign: 'center',
            fontWeight: 500,
            width: '100%',
          }}
        >
          {/* TODO: in production notFoundException is t */}
          {scanImageNotfoundErrors.includes(error.name) ? (
            <Loading message="🌀 Searching for Qr code" />
          ) : (
            error.message
          )}
        </div>
      )}
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}
