import Logo from "@/components/Logo";
import { BRAND } from "@/constants/brand";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <StyledToolbar variant="dense" disableGutters>
            <Box
              sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              >
                <Logo sx={{ fontSize: 36 }} />
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="primary.main"
                >
                  {BRAND.APP_NAME}
                </Typography>
              </Box>
              <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}>
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  onClick={() => navigate("/dashboard")}
                >
                  대시보드
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
              <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
                <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <IconButton onClick={toggleDrawer(false)}>
                      <CloseRoundedIcon />
                    </IconButton>
                  </Box>

                  <MenuItem
                    onClick={() => {
                      navigate("/");
                      toggleDrawer(false)();
                    }}
                  >
                    홈
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/dashboard");
                      toggleDrawer(false)();
                    }}
                  >
                    대시보드
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/conversion");
                      toggleDrawer(false)();
                    }}
                  >
                    새 변환
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/pricing");
                      toggleDrawer(false)();
                    }}
                  >
                    요금제
                  </MenuItem>
                  <Divider sx={{ my: 3 }} />
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth
                      onClick={() => navigate("/conversion")}
                    >
                      시작하기
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button color="primary" variant="outlined" fullWidth>
                      로그인
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, pt: 10 }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {BRAND.COPYRIGHT_YEAR} {BRAND.COMPANY_NAME}. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 1 }}
          >
            {BRAND.DESCRIPTION}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
