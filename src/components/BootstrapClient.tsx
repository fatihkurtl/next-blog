'use client';
import { useEffect } from "react";

// This component is responsible for importing and executing Bootstrap JavaScript on the client side.
export default function BootstrapClient() {
    useEffect(() => {
         // We import the Bootstrap JavaScript file when the component is mounted.
        require("bootstrap/dist/js/bootstrap.min.js");

        // Both are valid
        // import("bootstrap/dist/js/bootstrap.min.js");
    }, []);

    // The component does not need to render anything, so we return an empty fragment.
    return <></>;
}