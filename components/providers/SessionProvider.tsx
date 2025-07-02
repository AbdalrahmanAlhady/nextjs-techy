"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

const Provider = ({ children }: Props) => {
  return <>{children}</>;
};

export default Provider;
