import * as React from "react";
import EpisodesList from "../EpisodesList";
import useAuth from "../../hooks/useAuth";
import { ThemeProvider } from "@emotion/react";
import { Container, CssBaseline, createTheme } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { Episode } from "../../types/types";

const theme = createTheme();
export default function Profile() {
  const axiosPrivate = useAxiosPrivate();
  const [episodes, setEpisodes] = React.useState<Episode[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getContents = async () => {
      try {
        const res = await axiosPrivate.get("/api/v1/content", {
          signal: controller.signal,
        });
        console.log(res.data);
        isMounted && setEpisodes(res.data);
      } catch (error) {
        if (isMounted) {
          console.error(error);
          navigate("/signin", { state: { from: location }, replace: true });
        }
      }
    };
    getContents();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, location, navigate]);

  const handleDelete = async (episode: Episode) => {
    try {
      const res = await axiosPrivate.delete(`/api/v1/content/${episode.id}`);
      setEpisodes((prevEpisodes) =>
        prevEpisodes.filter((ep) => ep.id !== episode.id)
      );
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <h1>User Profile</h1>
          <EpisodesList episodes={episodes} handleDelete={handleDelete} />
        </Container>
      </ThemeProvider>
    </>
  );
}
