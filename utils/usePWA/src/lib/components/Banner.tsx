import './banner.css';

export default function Banner({
  installApp,
}: {
  installApp: () => Promise<void>;
}) {
  return (
    <div className="holder">
      <span className="message">
        To access the app from your phone, install now
      </span>
      <button className="install-button" onClick={installApp}>
        Install
      </button>
    </div>
  );
}
