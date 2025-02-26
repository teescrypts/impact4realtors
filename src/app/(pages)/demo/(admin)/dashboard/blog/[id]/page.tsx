import apiRequest from "@/app/lib/api-request";
import { BlogType } from "@/types";
import { cookies } from "next/headers";
import React from "react";
import { DraftImgType } from "../../listing/add/page";
import EditBlog from "../../components/edit-blog";
import { RouterLink } from "@/app/component/router-link";
import {
  Box,
  Container,
  Typography,
  Stack,
  Breadcrumbs,
  Link,
} from "@mui/material";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{
    data: { blog: BlogType; draftImg: DraftImgType };
  }>(`admin/blog/${id}`, {
    token,
    tag: "fetchAdminBlog",
  });

  const blog = response.data.blog;
  const draftImg = response.data.draftImg;

  return (
    <div>
      {" "}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 2 }}>
            Edit Blog
          </Typography>

          <Stack sx={{ mb: 2 }}>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                sx={{ cursor: "pointer" }}
                component={RouterLink}
                href={"/demo/dashboard/blog"}
              >
                Blog
              </Link>
              <Typography color="text.primary"> Edit Blog</Typography>
            </Breadcrumbs>
          </Stack>

          <EditBlog blog={blog} draftImg={draftImg} />
        </Container>
      </Box>
    </div>
  );
}

export default Page;
