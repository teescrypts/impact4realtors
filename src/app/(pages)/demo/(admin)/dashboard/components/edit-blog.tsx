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
import React, {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import FileDropzone from "@/app/component/file-dropzone";
import { QuillEditor } from "@/app/component/quil-editor";
import Image from "next/image";
import {
  deleteBlogImage,
  updateBlog,
  uploadImage,
} from "@/app/actions/server-actions";
import notify from "@/app/utils/toast";
import { ActionStateType, BlogType } from "@/types";
import { SubmitButton } from "@/app/component/submit-buttton";

export interface BlogDraftImageType {
  url: string;
  fileName: string;
  imageId: string;
}

const initialState: ActionStateType = null;

function EditBlog({
  draftImg,
  blog,
}: {
  draftImg: BlogDraftImageType | string;
  blog: BlogType;
}) {
  const [cover, setCover] = useState<{
    url: string;
    imageId: string;
    fileName: string;
  } | null>(null);

  const [content, setContent] = useState(blog.content);

  const [imgMsg, setImgMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof draftImg === "string") {
      setCover(blog.cover);
    } else {
      setCover({
        url: `${draftImg.url}?name=${draftImg.fileName}`,
        imageId: draftImg.imageId,
        fileName: draftImg.fileName,
      });
    }
  }, [draftImg, blog]);

  const handleCoverDrop = useCallback(
    async ([file]: File[]) => {
      if (!cover) {
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
    [cover]
  );

  const handleCoverRemove = useCallback(
    async (id: string) => {
      const result = await deleteBlogImage(id, blog._id);

      if (result?.error) setImgMsg(result.error);
      if (result?.message) {
        notify(result.message);
      }
    },
    [blog]
  );

  const contentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (contentRef.current && content) {
      contentRef.current.value = content;
    }
  }, [content]);

  const updateBlogPost = updateBlog.bind(null, cover, "Published");
  const [message, setMessage] = useState("");
  const [state, formAction] = useActionState(updateBlogPost, initialState);

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.message) notify(state.message);
    }
  }, [state]);

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
                  <input name="id" defaultValue={blog._id} hidden />
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Post title"
                    name="title"
                    defaultValue={blog.title}
                  />
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Short description"
                    name="shortDescription"
                    multiline
                    minRows={3}
                    defaultValue={blog.shortDescription}
                  />
                  <TextField
                    name="author"
                    variant="outlined"
                    fullWidth
                    label="Aurthor"
                    defaultValue={blog.author}
                  />

                  <TextField
                    name="estReadTime"
                    type="number"
                    variant="outlined"
                    fullWidth
                    label="Estimated Read Time"
                    slotProps={{ htmlInput: { min: 1 } }}
                    defaultValue={blog.estReadTime}
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
                  {cover && (
                    <div>
                      <Button
                        color="inherit"
                        disabled={!cover}
                        onClick={() => handleCoverRemove(cover.imageId)}
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
                  sx={{ height: 400 }}
                />
                <input ref={contentRef} name="content" type="hidden" />
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
        <SubmitButton title="Save Edit" isFullWidth={false} />
      </Stack>
    </form>
  );
}

export default EditBlog;
