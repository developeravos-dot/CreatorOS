import {
  useNetworkStatus,
} from "./useNetworkStatus";

export default function NetworkStatusBanner() {
  const {
    online,
    reconnected,
  } = useNetworkStatus();

  if (
    online &&
    !reconnected
  ) {
    return null;
  }

  return (
    <div
      className={[
        "creatoros-network-status",
        online
          ? "creatoros-network-status--online"
          : "creatoros-network-status--offline",
      ].join(" ")}
      role="status"
    >
      {online
        ? "تمت استعادة الاتصال بالخادم."
        : "الجهاز غير متصل بالإنترنت. ستبقى البيانات المخزنة مؤقتًا متاحة."}
    </div>
  );
}
