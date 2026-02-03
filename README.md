# Community Service Project

Spring Boot (Backend) + Next.js (Frontend) 기반의 커뮤니티 서비스입니다.

## 1. Requirement
- JDK 17+
- Node.js 18+

## 2. Default Configuration
- **Backend Port**: 8080
- **Frontend Port**: 3000
- **Database**: H2 (In-memory)
  - Console: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - User: `sa`
  - Password: (empty)

## 3. How to Run

### Backend (Spring Boot)
Open a terminal in the `backend` directory:
```bash
cd backend
# Windows
./gradlew bootRun

# Mac/Linux
./gradlew bootRun
```

### Frontend (Next.js)
Open a *new* terminal in the `frontend` directory:
```bash
cd frontend
npm run dev
```

## 4. API Documentation
- After running backend, access: http://localhost:3000
- Initial Test User: You need to Sign Up first via the UI.
