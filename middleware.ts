import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware() {}, {
  pages: {
    signIn: "/login",
  },
});
