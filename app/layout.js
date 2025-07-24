import Header from "../components/Headers";
import "./globals.scss";

export const metadata = {
  title: "포켓몬 도감",
  description: "나의 포켓몬을 찾아서",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="google-site-verification"
          content="08ocBbHhmQPTFPT-x5hvf5DIRSDXxprE4e0MZYaET1E"
        />
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}