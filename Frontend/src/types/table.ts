import type React from "react";

export interface Column <T, K extends keyof T = keyof T> {
    header: string;
    key: K ;
    render?: (value: T[K], item: T) => React.ReactNode;
}                     