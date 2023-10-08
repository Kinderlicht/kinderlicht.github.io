import Script from "next/script";

export default function Home() {
  return (
    <div className="px-0.5">
      <Script src="https://app.campai.com/lib/web-form.js"></Script>
      <web-form
        zone="campai"
        organisation="64e88fabfb6cef3375134031"
        form="65228c088027e5517c174547"
        css=".sd-root-modern{--base-unit: 8px;--primary: #484848;--primary-foreground: #ffa726;--foreground: #000000;--background: #ffffff;--background-dim: #f3f3f3;--background-dim-light: #f9f9f9;--font-family: initial;flex: 1;}.sv-tagbox__item, .sd-tagbox_clean-button{box-sizing: content-box;}"
        model="base64;eyJsb2NhbGUiOiJkZSIsInRpdGxlIjp7ImRlIjoiS29udGFrdGZvcm11bGFyIn0sImxvZ28iOnsiZGUiOiJodHRwczovL2FwaS5jYW1wYWkuY29tL3N0b3JhZ2UvZG93bmxvYWQvb3JnYW5pc2F0aW9uLzY0ZTg4ZmFiZmI2Y2VmMzM3NTEzNDAzMS9vcmdhbmlzYXRpb24vZXIzbmJscnpBUmVBQnF2VXUxMXNULnBuZyJ9LCJsb2dvV2lkdGgiOiIxMDBweCIsImxvZ29IZWlnaHQiOiIxMDBweCIsImxvZ29Qb3NpdGlvbiI6InJpZ2h0IiwiY29tcGxldGVkSHRtbCI6eyJkZSI6IjxoMT5WaWVsZW4gZGFuayBmw7xyIGRhcyBBdXNmw7xsbGVuPC9oMT5cbjxwPldpciB3ZXJkZW4gdW5zIHVtZ2VoZW5kIG1pdCBEaXIgaW4gVmVyYmluZHVuZyBzZXR6ZW4uPC9wPlxuIn0sInBhZ2VzIjpbeyJuYW1lIjoiU2VpdGUxIiwiZWxlbWVudHMiOlt7InR5cGUiOiJ0ZXh0IiwibmFtZSI6IkZyYWdlMSIsInRpdGxlIjp7ImRlIjoiVm9ybmFtZSJ9LCJpc1JlcXVpcmVkIjp0cnVlLCJmb3JtYXQiOiJ0ZXh0In0seyJ0eXBlIjoidGV4dCIsIm5hbWUiOiJGcmFnZTIiLCJzdGFydFdpdGhOZXdMaW5lIjpmYWxzZSwidGl0bGUiOnsiZGUiOiJOYWNobmFtZSJ9LCJpc1JlcXVpcmVkIjp0cnVlLCJmb3JtYXQiOiJ0ZXh0In0seyJ0eXBlIjoidGV4dCIsIm5hbWUiOiJGcmFnZTYiLCJ0aXRsZSI6eyJkZSI6Ik1vYmlsbnVtbWVyIn0sInZhbGlkYXRvcnMiOlt7InR5cGUiOiJtb2JpbGVfcGhvbmUifV0sImlucHV0VHlwZSI6InRlbCIsImZvcm1hdCI6Im1vYmlsZSJ9LHsidHlwZSI6InRleHQiLCJuYW1lIjoiRnJhZ2U3Iiwic3RhcnRXaXRoTmV3TGluZSI6ZmFsc2UsInRpdGxlIjp7ImRlIjoiRS1NYWlsLUFkcmVzc2UifSwiaXNSZXF1aXJlZCI6dHJ1ZSwidmFsaWRhdG9ycyI6W3sidHlwZSI6ImVtYWlsIn1dLCJpbnB1dFR5cGUiOiJlbWFpbCIsInBsYWNlaG9sZGVyIjp7ImRlIjoibWF4QG11c3Rlcm1hbm4uZGUifSwiZm9ybWF0IjoiZW1haWwifSx7InR5cGUiOiJ0ZXh0IiwibmFtZSI6IkZyYWdlMTIiLCJ0aXRsZSI6eyJkZSI6IkJldHJlZmYifSwiaXNSZXF1aXJlZCI6dHJ1ZSwiZm9ybWF0IjoidGV4dCJ9LHsidHlwZSI6ImNvbW1lbnQiLCJuYW1lIjoiRnJhZ2UxMSIsInRpdGxlIjp7ImRlIjoiQW5tZXJrdW5nZW4sIEZyYWdlKG4pIn0sImlzUmVxdWlyZWQiOnRydWV9LHsidHlwZSI6ImNoZWNrYm94IiwibmFtZSI6IkZyYWdlMTMiLCJ0aXRsZSI6eyJkZSI6IkRhdGVuc2NodXR6In0sImlzUmVxdWlyZWQiOnRydWUsImNob2ljZXMiOlt7InZhbHVlIjoiSXRlbSAxIiwidGV4dCI6eyJkZSI6IkphLCBpY2ggaGFiZSBkaWUgRGF0ZW5zY2h1dHplcmtsw6RydW5nIHp1ciBLZW5udG5pcyBnZW5vbW1lbiB1bmQgYmluIGRhbWl0IGVpbnZlcnN0YW5kZW4sIGRhc3MgZGllIHZvbiBtaXIgYW5nZWdlYmVuZW4gRGF0ZW4gendlY2tnZWJ1bmRlbiB6dXIgQmVhcmJlaXR1bmcgdW5kIEJlYW50d29ydHVuZyBtZWluZXIgQW5mcmFnZSBlbGVrdHJvbmlzY2ggZXJob2JlbiB1bmQgZ2VzcGVpY2hlcnQgd2VyZGVuLiBNaXQgZGVtIEFic2VuZGVuIGRlcyBLb250YWt0Zm9ybXVsYXJzIGVya2zDpHJlIGljaCBtaWNoIG1pdCBkZXIgVmVyYXJiZWl0dW5nIGVpbnZlcnN0YW5kZW4uIn19XX1dLCJ0aXRsZSI6eyJkZSI6IkJlc2NocmVpYmUgdW5zIGRlaW4gQW5saWVnZW4ifSwiZGVzY3JpcHRpb24iOnsiZGUiOiJIaWVyIGthbm5zdCBkdSB1bnZlcmJpbmRsaWNoIGVpbmUgQW5mcmFnZSBzdGVsbGVuIG9kZXIgZWluZmFjaCBtaXQgdW5zIGluIEtvbnRha3QgdHJldGVuLiBEYWJlaSBpc3QgZXMgZWdhbCwgb2IgZHUgZsO8ciBCZWthbm50ZSBvZGVyIGbDvHIgZGljaCBzZWxic3QgZWluZSBBbmZyYWdlIHN0ZWxsc3QuIFdpciBzZXR6ZW4gdW5zIHVtZ2VoZW5kIG1pdCBkaXIgaW4gVmVyYmluZHVuZy4ifX1dLCJ3aWR0aE1vZGUiOiJzdGF0aWMiLCJ3aWR0aCI6IjgwMHB4In0="
      ></web-form>
    </div>
  );
}
