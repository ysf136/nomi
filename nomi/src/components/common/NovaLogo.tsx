import React from "react";
import logo from "../assets/Nomi_Groß_Logo+Schrift.png";

export default function NovaLogo(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={logo}
      alt="nomi"
      style={{ height: "36px", display: "block" }}
      {...props}
    />
  );
}
