import { useEffect } from "react";
import { IntercomProvider, useIntercom } from "react-use-intercom";

// Intercom App ID
const INTERCOM_APP_ID = "oe9n91mi";

const IntercomBooter = () => {
  const { boot } = useIntercom();

  useEffect(() => {
    boot();
  }, [boot]);

  return null;
};

const IntercomChat = () => {
  return (
    <IntercomProvider appId={INTERCOM_APP_ID} autoBoot={false}>
      <IntercomBooter />
    </IntercomProvider>
  );
};

export default IntercomChat;
