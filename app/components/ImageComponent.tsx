'use client'
import { SyntheticEvent } from "react";
import { imageComponentProps } from "../indexType";

export default function ImageComponent({ imageSrc = "", title = "" }: imageComponentProps) {

    async function handleImageError(e: SyntheticEvent<HTMLImageElement, Event>) {

    }

    return (
        <div>
            <img
                onError={(e) => { handleImageError(e) }}
                src={imageSrc}
                alt={title}
                className="max-w-full max-h-full rounded object-contain"
            />
        </div>
    )
}
