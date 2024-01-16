import {
  BrowserMultiFormatReader,
  Exception as Exp,
  NotFoundException,
} from '@zxing/library';
import { useEffect, useRef } from 'react';
import { IQrScannerProps } from './qrScannerProps';

export function QrScanner<T = unknown>(props: IQrScannerProps<T>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    if (!videoRef.current) return;
    reader.current.timeBetweenDecodingAttempts = props.scanDelay ?? 500;
    reader.current.decodeFromConstraints(
      {
        audio: false,
        video: {
          facingMode: props.facingMode || 'environment',
        },
      },
      videoRef.current,
      (result, error) => {
        if (result) {
          const getData = () => {
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
                throw new Exp(error.message);
              throw new Exp('Unknown error');
            }
          };
          props.onResult(getData(), result);
        } else if (error) {
          if (!props.onError)
            console.warn('QrScanner: Unhandled execption');
          else if (
            // not found error is not an error
            !(error instanceof NotFoundException)
          )
            props.onError(error);

        } 
      }
    );
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      reader.current.reset();
    };
  }, [props, videoRef]);
  if (props.children) return <>{props.children(videoRef)}</>;
  return (
    <div
      style={{
        borderColor: 'rgb(147 197 253)',
        borderWidth: '4px',
        width: '100%',
      }}
    >
      <video ref={videoRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
