import type { Project } from "@/app/types";

export const PROJECTS: Project[] = [
  {
    title: "Mini Forum",
    titleVi: "Mini Forum",
    titleEn: "Mini Forum",
    summary:
      "Full-stack community platform for threaded discussions, role-based moderation, bookmarks, notifications, and media-rich posts.",
    summaryVi:
      "Mini Forum là một hệ thống diễn đàn full-stack được thiết kế để hỗ trợ các hoạt động cộng đồng trực tuyến theo mô hình sản phẩm thực tế, bao gồm đăng ký/đăng nhập, lập hồ sơ người dùng, tạo và chỉnh sửa bài viết, bình luận lồng nhau, vote, bookmark và nhận thông báo tức thời. Dự án tập trung vào việc xây dựng một nền tảng có thể quản lý nội dung hiệu quả, bảo vệ dữ liệu người dùng bằng xác thực và quyền truy cập, đồng thời tạo trải nghiệm tương tác mượt mà trên cả frontend và backend. Đây là một hệ thống phù hợp để thể hiện khả năng triển khai toàn diện từ giao diện người dùng, API, cơ sở dữ liệu cho đến logic nghiệp vụ và bảo mật.",
    summaryEn:
      "Mini Forum is a full-stack forum system designed to support real-world community interactions, including sign-up and login, user profile management, post creation and editing, nested comments, voting, bookmarking, and instant notifications. The project focuses on building a platform that can manage content effectively, protect user data through authentication and access control, and provide a smooth interaction experience across both frontend and backend layers. It is a strong example of end-to-end implementation covering UI, API design, data persistence, business logic, and security.",
    detailsVi: [
      "• Xây dựng luồng đăng ký, đăng nhập và hồ sơ người dùng với JWT access/refresh token; refresh token được lưu dưới dạng hash SHA-256 và có thời hạn 7 ngày.",
      "• Hỗ trợ tạo bài viết, chỉnh sửa, bình luận, vote, bookmark và thông báo tức thời; API bài viết có phân trang, lọc và kiểm soát hiển thị theo quyền truy cập.",
      "• Mô hình dữ liệu gồm posts, comments, bookmarks, notifications, refresh_tokens và media, kết nối qua Prisma với PostgreSQL.",
      "• Thiết kế API và frontend theo hướng có thể mở rộng cho quản trị, bảo mật và các tính năng cộng đồng nâng cao."
    ],
    detailsEn: [
      "• Built sign-up, login, and profile flows with JWT access/refresh tokens; refresh tokens are stored as SHA-256 hashes and expire after 7 days.",
      "• Supported post creation, editing, comments, voting, bookmarks, and instant notifications; the post API includes pagination, filtering, and role-aware visibility rules.",
      "• Modeled content through Prisma with PostgreSQL using posts, comments, bookmarks, notifications, refresh tokens, and media entities.",
      "• Structured the API and UI to support future moderation, security, and community features."
    ],
    highlightsVi: [
      "Mô hình cộng đồng thực tế, có thể dùng làm nền tảng cho sản phẩm forum hoàn chỉnh.",
      "Tập trung vào trải nghiệm người dùng và logic nghiệp vụ rõ ràng, dễ bảo trì."
    ],
    highlightsEn: [
      "A realistic community platform that can scale into a full forum product.",
      "Focused on user experience and clear business logic that is easy to maintain."
    ],
    tech: ["React", "Vite", "TypeScript", "Express", "Prisma", "PostgreSQL"],
    role: "Full-Stack Developer",
    roleVi: "Lập trình viên Full-Stack",
    roleEn: "Full-Stack Developer",
    github: "https://github.com/RevenantKitana/mini-forum",
    demo: "https://forum.mio.io.vn",
    architecture:
      "Frontend layer: React/Vite provides the user interface for authentication, post feeds, content creation, and notifications.\nBackend layer: Express services manage users, content, moderation, and real-time events.\nData layer: Prisma + PostgreSQL store persistent data and relational models such as posts, comments, bookmarks, and notifications.\nCross-cutting concerns: JWT authentication, refresh-token flow, SSE-based updates, and a monorepo organization that supports future growth in moderation, media handling, and security.",
    architectureVi:
      "Frontend layer: giao diện React/Vite phục vụ đăng nhập, feed bài viết, tạo bài, xem thông báo và tương tác người dùng.\nBackend layer: các service Express xử lý người dùng, nội dung, kiểm duyệt và các sự kiện thời gian thực.\nData layer: Prisma + PostgreSQL lưu trữ dữ liệu bền vững và các mô hình quan hệ như posts, comments, bookmarks và notifications.\nCross-cutting concerns: xác thực JWT, quy trình refresh token, cập nhật qua SSE và cấu trúc monorepo để mở rộng sang quản trị, xử lý media và bảo mật trong tương lai.",
    architectureEn:
      "Frontend layer: React/Vite provides the user interface for authentication, post feeds, content creation, and notifications.\nBackend layer: Express services manage users, content, moderation, and real-time events.\nData layer: Prisma + PostgreSQL store persistent data and relational models such as posts, comments, bookmarks, and notifications.\nCross-cutting concerns: JWT authentication, refresh-token flow, SSE-based updates, and a monorepo organization that supports future growth in moderation, media handling, and security.",
    imgId: "photo-1498050108023-c5249f4df085",
  },
    {
    title: "Vibe Content Agent",
    titleVi: "Vibe Content Agent",
    titleEn: "Vibe Content Agent",
    summary:
      "Autonomous content-generation service that creates forum posts, comments, and votes through multi-LLM orchestration with fallback and quality checks.",
    summaryVi:
      "Vibe Content Agent là một dịch vụ tự động sinh nội dung cho diễn đàn, được thiết kế để tạo bài viết, bình luận và vote dựa trên ngữ cảnh hiện tại và đặc điểm hành vi của từng bot user. Dự án này nhằm giữ cho cộng đồng luôn có hoạt động liên tục, tăng mức độ tương tác và giảm tải cho vận hành thủ công. Hệ thống được triển khai dưới dạng pipeline chạy theo lịch, thực hiện các bước thu thập thông tin ngữ cảnh, xây dựng prompt, gọi nhiều provider LLM, đánh giá chất lượng đầu ra và gửi nội dung đến API diễn đàn một cách có kiểm soát, đồng thời hỗ trợ failover và retry khi một provider gặp lỗi.",
    summaryEn:
      "Vibe Content Agent is an automated content service for the forum, designed to generate posts, comments, and votes based on the current context and behavioral traits of each bot user. The project aims to keep the community active, increase engagement, and reduce manual operational workload. The system is implemented as a scheduled pipeline that performs context gathering, prompt construction, multi-provider LLM calls, output quality evaluation, and controlled publishing to the forum API, while also supporting failover and retry mechanisms when a provider fails.",
    detailsVi: [
      "• Chạy pipeline theo lịch mỗi 30 phút với batch size 1; mỗi bot user tối đa 3 post, 6 comment và 15 vote mỗi ngày.",
      "• Thu thập ngữ cảnh, xây dựng prompt, gọi nhiều provider LLM và chạy validation/quality check trước khi publish.",
      "• Hỗ trợ nhiều provider như Gemini, Groq, Cerebras, Nvidia và Beeknoee, kèm failover, retry và health check.",
      "• Gửi nội dung về forum API sau khi qua các bước kiểm tra để giảm rủi ro nội dung không phù hợp."
    ],
    detailsEn: [
      "• Runs a scheduled pipeline every 30 minutes with a batch size of 1; each bot user is capped at 3 posts, 6 comments, and 15 votes per day.",
      "• Collects context, builds prompts, calls multiple LLM providers, and runs validation plus quality checks before publishing.",
      "• Supports providers such as Gemini, Groq, Cerebras, Nvidia, and Beeknoee, along with failover, retry, and health checks.",
      "• Publishes content to the forum API only after validation to reduce the risk of low-quality output."
    ],
    highlightsVi: [
      "Thể hiện khả năng kết hợp AI, automation và hệ thống backend thực tế.",
      "Có thể dùng làm nền tảng cho các agent nội dung hoặc workflow tự động hóa tiếp theo."
    ],
    highlightsEn: [
      "Shows strong capability in combining AI, automation, and real backend systems.",
      "Can serve as a foundation for future content agents or automated workflows."
    ],
    tech: ["Node.js", "Express", "Gemini", "Multi-LLM", "Cron", "Prisma"],
    role: "Backend + AI Engineer",
    roleVi: "Backend + AI Engineer",
    roleEn: "Backend + AI Engineer",
    github: "https://github.com/RevenantKitana/mini-forum/tree/main/vibe-content",
    demo: "#ai-trigger-demo",
    architecture:
      "Execution flow: the scheduler selects an action, gathers context, builds prompts, calls multiple LLM providers, validates the response, and publishes the result through the forum API.\nReliability layer: failover, retry, rate limiting, and circuit-breaker logic protect the service when one provider fails or traffic scales up.\nOperational model: the system is designed for periodic automated engagement with bounded daily activity and measurable quality checks.",
    architectureVi:
      "Execution flow: scheduler chọn hành động, thu thập ngữ cảnh, xây dựng prompt, gọi nhiều provider LLM, kiểm tra phản hồi và publish kết quả qua forum API.\nReliability layer: failover, retry, rate limiting và circuit breaker bảo vệ hệ thống khi một provider gặp lỗi hoặc lưu lượng tăng.\nOperational model: hệ thống được thiết kế cho hoạt động tự động định kỳ, với giới hạn hành động hàng ngày và kiểm tra chất lượng có thể đo lường.",
    architectureEn:
      "Execution flow: the scheduler selects an action, gathers context, builds prompts, calls multiple LLM providers, validates the response, and publishes the result through the forum API.\nReliability layer: failover, retry, rate limiting, and circuit-breaker logic protect the service when one provider fails or traffic scales up.\nOperational model: the system is designed for periodic automated engagement with bounded daily activity and measurable quality checks.",
    imgId: "photo-1677442136019-21780ecad995",
  },
  {
    title: "Admin Moderation Console",
    titleVi: "Bảng điều khiển quản trị",
    titleEn: "Admin Moderation Console",
    summary:
      "Internal operations dashboard for moderators and administrators to manage users, content, reports, categories, and audit logs.",
    summaryVi:
      "Bảng điều khiển quản trị được xây dựng để hỗ trợ moderator và admin điều hành hệ thống diễn đàn thông qua một giao diện tập trung, có cấu trúc rõ ràng và dễ theo dõi. Dự án này cho phép quản lý người dùng, duyệt và kiểm duyệt bài viết, kiểm soát bình luận, xử lý báo cáo vi phạm và theo dõi nhật ký hoạt động quản trị. Mục tiêu không chỉ là tạo giao diện thao tác mà còn xây dựng một workflow vận hành hiệu quả, nơi trạng thái nội dung, quyền hạn và dữ liệu được tổ chức theo logic rõ ràng nhằm nâng cao năng suất vận hành và kiểm soát hệ thống.",
    summaryEn:
      "The admin moderation console was built to support moderators and administrators in operating the forum through a centralized, clearly structured, and easy-to-follow interface. The project enables user management, post review and moderation, comment control, violation reporting, and audit-log tracking. The goal is not only to provide an operational UI, but also to establish an effective workflow where content status, permissions, and data are organized in a clear logic to improve operational efficiency and system control.",
    detailsVi: [
      "• Thiết kế dashboard quản trị với các module người dùng, nội dung, báo cáo, category/tag và audit logs.",
      "• Hỗ trợ workflow kiểm duyệt theo trạng thái PENDING, REVIEWING, RESOLVED và DISMISSED cho các report và nội dung.",
      "• Tích hợp điều hướng bảo mật và kiểm soát truy cập theo vai trò ADMIN/MODERATOR trên toàn bộ admin routes.",
      "• Tối ưu trải nghiệm thao tác cho các tác vụ vận hành hàng ngày như pin/unpin bài, khóa bài, đổi vai trò và xử lý báo cáo."
    ],
    detailsEn: [
      "• Designed an admin dashboard with modules for users, content, reports, categories/tags, and audit logs.",
      "• Supported moderation workflows with states such as PENDING, REVIEWING, RESOLVED, and DISMISSED for reports and content.",
      "• Integrated secure navigation and role-based access control for ADMIN/MODERATOR routes across the admin area.",
      "• Optimized the operational UX for daily tasks such as pinning posts, locking content, changing roles, and processing reports."
    ],
    highlightsVi: [
      "Nhấn mạnh vào khả năng vận hành hệ thống và kiểm soát nội dung hiệu quả.",
      "Giao diện tập trung giúp đội ngũ quản trị làm việc rõ ràng và nhanh hơn."
    ],
    highlightsEn: [
      "Focused on effective system operations and content control.",
      "A centralized UI helps the moderation team work with clearer workflow and faster decisions."
    ],
    tech: ["React", "Vite", "TanStack Query", "Axios", "Radix UI", "Tailwind CSS"],
    role: "Frontend Developer",
    roleVi: "Lập trình viên Frontend",
    roleEn: "Frontend Developer",
    github: "https://github.com/RevenantKitana/mini-forum/tree/main/admin-client",
    demo: "https://admin.forum.mio.io.vn",
    architecture:
      "Admin shell: protected routes combine authentication, token refresh, and role-based access control.\nData flow: dashboards consume API data to present moderation state, while workflow statuses such as PENDING, REVIEWING, RESOLVED, and DISMISSED guide each operational action.\nUI layer: React, Radix UI, and Tailwind provide a consistent and efficient interface for repetitive administrative tasks such as content review, role changes, and report handling.",
    architectureVi:
      "Admin shell: các route quản trị kết hợp xác thực, refresh token và kiểm soát truy cập theo vai trò.\nLuồng dữ liệu: dashboard lấy dữ liệu từ API để trình bày trạng thái kiểm duyệt, trong khi các trạng thái như PENDING, REVIEWING, RESOLVED và DISMISSED điều hướng từng thao tác vận hành.\nUI layer: React, Radix UI và Tailwind tạo giao diện nhất quán và hiệu quả cho các tác vụ quản trị lặp lại như duyệt nội dung, đổi vai trò và xử lý báo cáo.",
    architectureEn:
      "Admin shell: protected routes combine authentication, token refresh, and role-based access control.\nData flow: dashboards consume API data to present moderation state, while workflow statuses such as PENDING, REVIEWING, RESOLVED, and DISMISSED guide each operational action.\nUI layer: React, Radix UI, and Tailwind provide a consistent and efficient interface for repetitive administrative tasks such as content review, role changes, and report handling.",
    imgId: "photo-1552664730-d307ca884978",
  },
  {
    title: "Emotion Recognition with MobileNetV2",
    titleVi: "Emotion Recognition with MobileNetV2",
    titleEn: "Emotion Recognition with MobileNetV2",
    summary:
      "An AI-powered facial emotion recognition system that classifies seven basic emotions from images and real-time video using a MobileNetV2-based deep learning model.",
    summaryVi:
      "Đây là hệ thống nhận diện cảm xúc khuôn mặt bằng trí tuệ nhân tạo, sử dụng mô hình deep learning dựa trên MobileNetV2 để phân loại 7 cảm xúc cơ bản từ ảnh tĩnh và video thời gian thực. Dự án kết hợp huấn luyện CNN, tiền xử lý hình ảnh và phát hiện khuôn mặt để tạo ra một giải pháp nhận diện trực quan, có thể dùng cho demo, nghiên cứu hoặc tích hợp vào ứng dụng desktop.",
    summaryEn:
      "This is a facial emotion recognition system powered by AI, using a MobileNetV2-based deep learning model to classify seven basic emotions from static images and real-time video. The project combines CNN training, image preprocessing, and face detection to create a practical recognition solution suitable for demos, research, and desktop application integration.",
    detailsVi: [
      "• Huấn luyện mô hình phân loại 7 cảm xúc bằng transfer learning từ MobileNetV2 với dữ liệu ảnh được tổ chức theo thư mục lớp.",
      "• Áp dụng tiền xử lý hình ảnh như resize, normalization, CLAHE, edge detection và median filter để cải thiện độ chính xác.",
      "• Hỗ trợ hai luồng sử dụng: phát hiện cảm xúc thời gian thực từ webcam và phân tích ảnh thông qua giao diện desktop GUI.",
      "• Cung cấp các công cụ đánh giá như confusion matrix, classification report, accuracy/loss plot và lưu trữ ảnh đã phát hiện theo từng cảm xúc."
    ],
    detailsEn: [
      "• Trains a seven-class emotion classifier using transfer learning from MobileNetV2 with directory-based image datasets.",
      "• Applies image preprocessing techniques such as resizing, normalization, CLAHE, edge detection, and median filtering to improve accuracy.",
      "• Supports two usage modes: real-time webcam emotion detection and image-based analysis through a desktop GUI.",
      "• Includes evaluation tools such as confusion matrices, classification reports, accuracy/loss plots, and saved face storage by emotion category."
    ],
    highlightsVi: [
      "Thể hiện khả năng xây dựng hệ thống computer vision kết hợp deep learning và ứng dụng thực tế.",
      "Có thể dùng làm nền tảng cho các dự án nhận diện cảm xúc, human-computer interaction hoặc demo AI trực quan."
    ],
    highlightsEn: [
      "Shows strong capability in building computer vision systems that combine deep learning with practical applications.",
      "Can serve as a foundation for emotion recognition, human-computer interaction, or visually compelling AI demos."
    ],
    tech: ["TensorFlow", "Keras", "MobileNetV2", "OpenCV", "Tkinter", "NumPy", "Scikit-learn", "Matplotlib"],
    role: "AI / Computer Vision Engineer",
    roleVi: "AI / Computer Vision Engineer",
    roleEn: "AI / Computer Vision Engineer",
    github: "https://github.com/RevenantKitana/emotion_recognition_usemobilenetv2",
    demo: "#",
    architecture:
      "Training flow: prepare image datasets, build a MobileNetV2-based classifier, train with transfer learning and callbacks, then save the best model for inference.\nInference flow: detect faces from images or webcam frames, preprocess the face region, run model prediction, and render results through the GUI or OpenCV windows.\nOperational model: the system is designed for both offline evaluation and real-time interaction with bounded, explainable outputs.",
    architectureVi:
      "Training flow: chuẩn bị dataset ảnh, xây dựng bộ phân loại dựa trên MobileNetV2, huấn luyện bằng transfer learning và callbacks, rồi lưu mô hình tốt nhất cho inference.\nInference flow: phát hiện khuôn mặt từ ảnh hoặc khung hình webcam, tiền xử lý vùng mặt, chạy dự đoán và hiển thị kết quả qua GUI hoặc cửa sổ OpenCV.\nOperational model: hệ thống được thiết kế cho cả đánh giá offline và tương tác thời gian thực với đầu ra dễ giải thích.",
    architectureEn:
      "Training flow: prepare image datasets, build a MobileNetV2-based classifier, train with transfer learning and callbacks, and save the best model for inference.\nInference flow: detect faces from images or webcam frames, preprocess the face region, run predictions, and display results through the GUI or OpenCV windows.\nOperational model: the system is designed for both offline evaluation and real-time interaction with explainable outputs.",
    imgId: "photo-1516321318423-f06f85e504b3"
  },
];
