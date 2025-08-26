import React, { useEffect, useRef } from "react";
import {
  createJSONEditor,
  JSONEditor as JSEditor,
  JSONEditorPropsOptional,
} from "vanilla-jsoneditor";

import FormControl from "@mui/material/FormControl";
import { Box, FormLabel } from "@mui/material";

export interface JSONEditorProps extends JSONEditorPropsOptional {
  style?: React.CSSProperties;
  boxStyle?: React.CSSProperties;
  label?: React.ReactNode;
}

export default function JSONEditor(props: JSONEditorProps) {
  const refContainer = useRef<HTMLDivElement | null>(null);
  const refEditor = useRef<JSEditor | null>(null);

  useEffect(() => {
    // create editor
    if (refContainer.current) {
      refEditor.current = createJSONEditor({
        target: refContainer.current,
        props: {},
      });
    }

    return () => {
      // destroy editor
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  // update props
  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.updateProps(props);
    }
  }, [props]);

  return (
    <FormControl
      fullWidth
      variant="outlined"
      style={{
        ...(props.style || {}),
      }}
    >
      {props.label && <FormLabel component="legend">{props.label}</FormLabel>}
      <Box
        display="flex"
        ref={refContainer}
        style={{
          boxSizing: "border-box",
          borderRadius: 4,
          padding: 1,
          backgroundColor: "#d7d7d7",
          ...(props.boxStyle || {}),
        }}
      />
    </FormControl>
  );
}
