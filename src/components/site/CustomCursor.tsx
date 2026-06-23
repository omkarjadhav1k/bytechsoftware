import { useEffect, useState } from "react";

export function CustomCursor() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <style>{`
      @media (hover: hover) and (pointer: fine) {
        /* Custom macOS (MacBook) black arrow with sharp white outline */
        * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M0 0v16.03l4.74-4.07 3.4 7.38 2.68-1.28-3.4-7.32h5.02L0 0z' fill='black' stroke='white' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E"), default;
        }

        /* Native pointer hand for all interactive elements */
        a, a *, 
        button, button *, 
        [role='button'], [role='button'] *, 
        input[type='button'], input[type='submit'], 
        select, label, label * {
          cursor: pointer !important;
        }

        /* Standard text cursor for text editing areas */
        input[type='text'], 
        input[type='email'], 
        input[type='search'], 
        input[type='password'], 
        input[type='tel'], 
        input[type='url'], 
        textarea {
          cursor: text !important;
        }
      }
    `}</style>
  );
}



