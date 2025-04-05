import { isMobileDevice } from "./deviceCheck";

export function getVenmoLink() {
  return isMobileDevice()
    ? "https://www.paypal.com/qrcodes/venmocs/e1ef4208-937e-4d4e-8ab9-6e5fa6b02cbc?created=1727139306.399119"
    : "https://account.venmo.com/pay?recipients=anthonykind";
}
