import bniLogo from "@/assets/images/bni.png";
import deloitteLogo from "@/assets/images/deloitte.png";
import eyLogo from "@/assets/images/ey_korea.jpeg";
import hyundaiLogo from "@/assets/images/hyundai.jpeg";
import kpmgLogo from "@/assets/images/kpmg.png";
import lgLogo from "@/assets/images/lg.png";
import pwcLogo from "@/assets/images/pwc.png";
import samilLogo from "@/assets/images/samil.png";
import samsungLogo from "@/assets/images/samsung.png";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const logos = [
  { name: "삼일회계법인", logo: samilLogo },
  { name: "삼정KPMG", logo: kpmgLogo },
  { name: "안진회계법인", logo: eyLogo },
  { name: "현대자동차", logo: hyundaiLogo },
  { name: "Deloitte", logo: deloitteLogo },
  { name: "LG전자", logo: lgLogo },
  { name: "PWC", logo: pwcLogo },
  { name: "Samsung", logo: samsungLogo },
  { name: "BNI", logo: bniLogo },
];

const logoStyle = {
  maxWidth: "100px",
  maxHeight: "60px",
  margin: "0 24px",
  opacity: 0.6,
  objectFit: "contain" as const,
};

export default function LogoCollection() {
  return (
    <Box id="logoCollection" sx={{ py: 4 }}>
      <Typography
        component="p"
        variant="subtitle2"
        align="center"
        sx={{ color: "text.secondary" }}
      >
        이미 50+개의 기업이 신뢰하는 솔루션
      </Typography>
      <Grid container sx={{ justifyContent: "center", mt: 2 }}>
        {logos.map((company, index) => (
          <Grid key={index}>
            <img src={company.logo} alt={company.name} style={logoStyle} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
