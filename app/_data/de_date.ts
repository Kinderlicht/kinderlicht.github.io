export function ConvertDate(date: number[]) {
    const d = ConvertDateObject(date);
    return (
      d.toLocaleDateString("de", {
        timeZone: "CET",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }) +
      " um " +
      d.toLocaleTimeString("de", {
        timeZone: "CET",
        hour: "2-digit",
        minute: "2-digit",
      }) +
      " Uhr"
    );
  }
  
export function ConvertDateObject(date: number[]): Date {
    let mapped = date.map((num: number) => {
      if (num < 10) {
        return "0" + num;
      }
      return num + "";
    });
  
    return new Date(
      mapped[0] +
        "-" +
        mapped[1] +
        "-" +
        mapped[2] +
        "T" +
        mapped[3] +
        ":" +
        mapped[4] +
        ":00"
    );
  }