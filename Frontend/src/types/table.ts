import type React from "react";

export interface Column <T> {
    header: string;
    key: keyof T ;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
}