import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

type AOS_Easing =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'ease-in-back'
  | 'ease-out-back'
  | 'ease-in-out-back'
  | 'ease-in-sine'
  | 'ease-out-sine'
  | 'ease-in-out-sine'
  | 'ease-in-quad'
  | 'ease-out-quad'
  | 'ease-in-out-quad'
  | 'ease-in-cubic'
  | 'ease-out-cubic'
  | 'ease-in-out-cubic'
  | 'ease-in-quart'
  | 'ease-out-quart'
  | 'ease-in-out-quart';

interface AOSOptions {
  duration?: number;
  easing?: AOS_Easing;
  once?: boolean;
  [key: string]: unknown; // For additional AOS options
}

const useAOS = (options: AOSOptions = {}) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in',
      once: true,
      ...options,
    });

    AOS.refresh();

    return () => {
      AOS.refreshHard();
    };
  }, [options]); // Re-run if options change
};

export default useAOS;