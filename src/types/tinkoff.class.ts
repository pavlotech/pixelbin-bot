import axios from "axios";
import crypto from "crypto";

export class tinkoffPAY {
  private shopId: string
  public secretKey: string
  constructor (shopId: string, secretKey: string) {
    this.shopId = shopId;
    this.secretKey = secretKey;
  }

  public createSignature (dict: any) {
    for (const value of ["Shops", "Receipt", "DATA"]) {
      if (value in dict) delete dict[value];
    }
    let strToHash = "";
    for (const [key, value] of Object.entries(dict).sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()))) strToHash += value;

    return crypto.createHash("sha256").update(strToHash).digest("hex");
  };

  public request (o: any, body = {}) {
    return new Promise((resolve, reject) => {
      axios
        .post(`https://securepay.tinkoff.ru/v2/${o}`, JSON.stringify(body), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  };

  public createInvoice (data: any, receipt: any) {
    return this.request("Init", {
      TerminalKey: this.shopId,
      ...data,
      Receipt: receipt,
      Token: this.createSignature({
        Password: this.secretKey,
        ...data,
        TerminalKey: this.shopId,
      }),
    });
  };

  public statusInvoice (paymentId: any) {
    return this.request("GetState", {
      TerminalKey: this.shopId,
      PaymentId: paymentId,
      Token: this.createSignature({
        Password: this.secretKey,
        PaymentID: paymentId,
        TerminalKey: this.shopId,
      }),
    });
  };
}