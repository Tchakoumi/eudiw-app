import './loading.css';

export interface ILoadingProps {
  loadingMessage: string;
}

export function Loading({ loadingMessage }: ILoadingProps) {
  return (
    <div className="loading-span">
      <span role="img" aria-label="loading" style={{ animation: 'none' }}>
        {loadingMessage}
      </span>
      {'...'.split('').map((letter, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
          {letter}
        </span>
      ))}
    </div>
  );
}
