import { usePWA, InstallPWAContextProvider } from '../index';
import { render } from '@testing-library/react';

describe('usePWA', () => {
  it('should be used successfully', () => {
    const UsingPWA = () => {
      const { isInstallable } = usePWA();
      return <div>{isInstallable}</div>;
    };

    const { baseElement } = render(
      <InstallPWAContextProvider>
        <UsingPWA></UsingPWA>
      </InstallPWAContextProvider>
    );

    expect(baseElement).toBeTruthy();
  });
});
