"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useActionState, useCallback, useEffect, useState } from "react";
import FileDropzone from "@/app/component/file-dropzone";
import { QuillEditor } from "@/app/component/quil-editor";
import Image from "next/image";
import {
  deleteImage,
  uploadBlog,
  uploadImage,
} from "@/app/actions/server-actions";
import notify from "@/app/utils/toast";
import { ActionStateType } from "@/types";
import { SubmitButton } from "@/app/component/submit-buttton";
import { useRouter } from "nextjs-toploader/app";

export interface BlogDraftImageType {
  url: string;
  fileName: string;
  imageId: string;
}

const initialState: ActionStateType = null;

function AddBlog({ draftImg }: { draftImg: BlogDraftImageType | string }) {
  const [cover, setCover] = useState<{
    url: string;
    imageId: string;
    fileName: string;
  } | null>(null);

  const [content, setContent] = useState("");

  const [imgMsg, setImgMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof draftImg === "string") {
      setCover(null);
    } else {
      setCover({
        url: `${draftImg.url}?name=${draftImg.fileName}`,
        imageId: draftImg.imageId,
        fileName: draftImg.fileName,
      });
    }
  }, [draftImg]);

  const handleCoverDrop = useCallback(
    async ([file]: File[]) => {
      if (typeof draftImg === "string") {
        setLoading(true);
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("type", "blog");

          const result = await uploadImage(formData);

          if (result.error) {
            setLoading(false);
            setImgMsg(result.error);
          }
        }
      } else {
        alert(
          "A cover image already exists. Please remove it before uploading a new one."
        );
      }

      setLoading(false);
    },
    [draftImg]
  );

  const handleCoverRemove = useCallback(async (id: string) => {
    const result = await deleteImage(id);

    if (result?.error) setImgMsg(result.error);
    if (result?.message) {
      notify(result.message);
    }
  }, []);

  const router = useRouter();

  const publishBlog = uploadBlog.bind(null, cover, "Published");
  const [message, setMessage] = useState("");
  const [state, formAction] = useActionState(publishBlog, initialState);

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.message) router.push("/demo/dashboard/blog");
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Basic details</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Stack spacing={3}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Post title"
                    name="title"
                  />
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Short description"
                    name="shortDescription"
                    multiline
                    minRows={3}
                  />
                  <TextField
                    name="author"
                    variant="outlined"
                    fullWidth
                    label="Aurthor"
                  />

                  <TextField
                    name="estReadTime"
                    type="number"
                    variant="outlined"
                    fullWidth
                    label="Estimated Read Time"
                    slotProps={{ htmlInput: { min: 1 } }}
                  />
                </Stack>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Post cover</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Typography color="error" variant="subtitle2">
                  {imgMsg}
                </Typography>
                {loading && <CircularProgress />}
                <Stack spacing={3}>
                  {cover ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 500,
                        mt: 3,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={cover.url}
                        alt="Blog Cover"
                        width={500} // Set appropriate width
                        height={300} // Set appropriate height
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                        priority // Optional: Ensures image loads quickly
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        border: 1,
                        borderRadius: 1,
                        borderStyle: "dashed",
                        borderColor: "divider",
                        height: 230,
                        mt: 3,
                        p: 3,
                      }}
                    >
                      <Typography
                        align="center"
                        color="text.secondary"
                        variant="h6"
                      >
                        Select a cover image
                      </Typography>
                      <Typography
                        align="center"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                        variant="subtitle1"
                      >
                        Image used for the blog post cover and also for Open
                        Graph meta
                      </Typography>
                    </Box>
                  )}
                  {typeof draftImg !== "string" && (
                    <div>
                      <Button
                        color="inherit"
                        disabled={!cover}
                        onClick={() => handleCoverRemove(draftImg.imageId)}
                      >
                        Remove photo
                      </Button>
                    </div>
                  )}
                  <FileDropzone
                    accept={{ "image/*": [] }}
                    onDrop={handleCoverDrop}
                    caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                  />
                </Stack>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Content</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <QuillEditor
                  value={content}
                  onChange={(value: string) => setContent(value)}
                  placeholder="Write something"
                  sx={{ height: 330 }}
                />
                <input defaultValue={content} hidden name="content" />
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
      </Stack>

      <Typography color="error" textAlign={"center"} variant="subtitle2">
        {message}
      </Typography>

      <Stack
        sx={{
          mt: 2,
        }}
        justifyContent={"flex-end"}
        direction={"row"}
      >
        <SubmitButton title="Publish post" isFullWidth={false} />
      </Stack>
    </form>
  );
}

export default AddBlog;
