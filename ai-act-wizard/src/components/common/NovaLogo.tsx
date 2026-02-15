import React from "react";
import logo from "../assets/nova_logo_horizontal_header.png";

export default function NovaLogo(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={logo}
      alt="NOVA Logo"
      style={{ height: "36px", display: "block" }}
      {...props}
    />
  );
}
