import { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosError } from "axios";
import { Button, Grid } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) {
      return;
    }

    try {
      const authToken = localStorage.getItem("authorization_token");
      const authHeader = authToken
        ? {
            Authorization: `Basic ${authToken}`,
          }
        : undefined;

      const response = await axios({
        method: "GET",
        url,
        headers: authHeader,
        params: {
          name: encodeURIComponent(file.name),
        },
      });

      const uploadUrl = response.data;

      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
      });

      setFile(undefined);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.message);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Grid container columnSpacing={2}>
        {!file ? (
          <Grid item>
            <Button
              component="label"
              variant="contained"
              size="small"
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <input
                type="file"
                style={{ display: "none" }}
                onChange={onFileChange}
              ></input>
            </Button>
          </Grid>
        ) : (
          <>
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={removeFile}
              >
                Remove file
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={uploadFile}
              >
                Upload file
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}
