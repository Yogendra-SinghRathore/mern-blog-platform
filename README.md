
```
backend-by-chatGPT
├─ 01backend
│  ├─ .env
│  ├─ nodemon.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ temp
│  └─ src
│     ├─ app.js
│     ├─ constants
│     │  └─ cookieOptions.js
│     ├─ controllers
│     │  ├─ auth.controller.js
│     │  └─ post.controller.js
│     ├─ db
│     │  └─ db.js
│     ├─ index.js
│     ├─ middleware
│     │  ├─ auth.middleware.js
│     │  ├─ error.middleware.js
│     │  ├─ multer.middleware.js
│     │  ├─ rateLimit.middleware.js
│     │  └─ validateRequiredFields.middleware.js
│     ├─ models
│     │  ├─ post.model.js
│     │  └─ user.model.js
│     ├─ routes
│     │  ├─ auth.routes.js
│     │  └─ post.routes.js
│     └─ utils
│        ├─ ApiError.js
│        ├─ ApiResponse.js
│        ├─ asyncHandler.js
│        ├─ cloudinary.js
│        └─ sendEmail.js
└─ 02frontend
   ├─ eslint.config.js
   ├─ index.html
   ├─ package-lock.json
   ├─ package.json
   ├─ public
   ├─ README.md
   ├─ src
   │  ├─ App.jsx
   │  ├─ assets
   │  ├─ components
   │  │  ├─ BackButton.jsx
   │  │  ├─ Footer.jsx
   │  │  ├─ Loader.jsx
   │  │  ├─ Navbar.jsx
   │  │  └─ ProtectedRoute.jsx
   │  ├─ context
   │  │  └─ AuthContext.jsx
   │  ├─ hooks
   │  ├─ index.css
   │  ├─ main.jsx
   │  ├─ pages
   │  │  ├─ AddPost.jsx
   │  │  ├─ Dashboard.jsx
   │  │  ├─ ForgotPassword.jsx
   │  │  ├─ Login.jsx
   │  │  ├─ MyPosts.jsx
   │  │  ├─ NotFound.jsx
   │  │  ├─ PostDetail.jsx
   │  │  ├─ Profile.jsx
   │  │  ├─ Register.jsx
   │  │  ├─ ResetPassword.jsx
   │  │  └─ VerifyEmail.jsx
   │  ├─ services
   │  │  ├─ api.js
   │  │  ├─ authService.js
   │  │  └─ postService.js
   │  └─ utils
   └─ vite.config.js

```