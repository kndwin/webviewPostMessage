import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const eid = router.query?.eid;
  const { status } = useScript(
    "https://www.eventbrite.com/static/widgets/eb_widgets.js"
  );
  const createWidget = ({ eventId }) => {
    if (Boolean(eventId)) {
      try {
        var onOrderCompleteCallback = function (order) {
          //@ts-ignore
          window?.ReactNativeWebView?.postMessage(JSON.stringify(order));
        };
        //@ts-ignore
        window.EBWidgets.createWidget({
          widgetType: "checkout",
          eventId,
          iframeContainerId: `checkout-${eventId}`,
          iframeContainerHeight: window.innerHeight,
          onOrderComplete: onOrderCompleteCallback,
        });
      } catch (error) {
        console.error(error);
      } finally {
        //@ts-ignore
        console.log("eventbrite loaded");
      }
    }
  };

  useEffect(() => {
    console.log({ status, eid });
    if (status === "ready" && Boolean(eid)) {
      createWidget({ eventId: eid });
    }
  }, [status, eid]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>

      <main className={styles.main}>
        {Boolean(eid) ? (
          <div id={`checkout-${eid}`}></div>
        ) : (
          <h1>No event id</h1>
        )}
        {status === "loading" && <Loading />}
      </main>
    </div>
  );
}

const Loading = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <h1>{`Loading...`}</h1>
  </div>
);

function useScript(url) {
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    setStatus("loading");
    const script = document.createElement("script");

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    script.onload = () => {
      setStatus("ready");
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);

  return {
    status,
  };
}
