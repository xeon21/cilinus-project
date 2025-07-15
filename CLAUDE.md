# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Backend (NestJS)
```bash
# Development
npm run start:dev     # Start in watch mode with hot reload
npm run start:debug   # Start with debugging enabled

# Building & Production
npm run build        # Build the application
npm run start:prod   # Run the production build

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:cov     # Run tests with coverage report
npm run test:e2e     # Run end-to-end tests

# Code Quality
npm run lint         # Lint and fix TypeScript files
npm run format       # Format code with Prettier
```

### Frontend (Next.js)
```bash
# Development
npm run dev          # Start development server with Turbopack

# Building & Production
npm run build        # Build the application
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run test         # Run Jest tests
```

## High-Level Architecture

### Full-Stack Application Structure
This is a full-stack TypeScript application with:
- **Backend**: NestJS REST API with MySQL database
- **Frontend**: Next.js 15 with App Router and React 19
- **Authentication**: JWT-based with role-based access control
- **State Management**: Zustand with persistence in frontend

### Backend Architecture (NestJS)
- **Modular Design**: Each feature is a separate NestJS module
- **Repository Pattern**: Data access abstracted in `*.repository.ts` files
- **Service Layer**: Business logic in `*.service.ts` files
- **DTO Pattern**: Request/response validation using DTOs
- **Authentication**: JWT with Passport strategy and Guards
- **Logging**: Winston with daily rotating file logs
- **API Documentation**: Swagger UI available at `/api-docs`

Key modules include:
- `auth/` - JWT authentication and authorization
- `userinfo/` & `login/` - User management
- `admin/` - Administrative functions
- `project/` - Project management
- `canvas-resolution/` - Canvas configuration
- `game/` - Game-related features
- `resource/` - System resource monitoring

### Frontend Architecture (Next.js)
- **App Router**: File-based routing with Next.js 15
- **Component Organization**: Feature-based component structure
- **Styling**: Hybrid approach using styled-components + Tailwind CSS
- **State Management**: Zustand stores for global state
- **API Integration**: Axios for HTTP requests
- **UI Features**: Drag-and-drop (dnd-kit), resizable components (react-rnd), charts (recharts)

Key features include:
- Dashboard with statistics and monitoring
- Scene editor with drag-and-drop functionality
- Board management system
- Tag status management
- Admin panel interface

### Development Philosophy
The project follows Test-Driven Development (TDD) principles:
1. **Red-Green-Refactor Cycle**: Write failing test → Make it pass → Refactor
2. **Clean First Approach**: Separate structural from behavioral changes
3. **Single Responsibility**: Keep methods small and focused
4. **Functional Programming**: Prefer functional style in TypeScript
5. **Commit Discipline**: Only commit when all tests pass

### Database Configuration
- **Primary Database**: MySQL with mysql2 driver
- **Secondary Database**: MongoDB with Mongoose (for specific features)
- **Connection Pooling**: Enabled for MySQL
- **Transactions**: Supported for data consistency

### Security Considerations
- JWT tokens for authentication
- bcrypt for password hashing
- Role-based access control (RBAC)
- CORS enabled for cross-origin requests
- 50MB request body limit for file uploads

md의 지침을 항상 따르세요. 제가 "실행"이라고 하면 gemini.md에서 표시되지 않은 다음 테스트를 찾아 구현한 후, 해당 테스트를 통과할 만큼의 코드만 구현하세요.

# 역할 및 전문성

당신은 React, NextJS, NestJS, MySQL, MongoDB를 사용한  풀스텍 웹 소프트웨어 엔지니어입니다. 당신의 목표는 이러한 방법론을 정확하게 준수하여 개발을 안내하는 것입니다.

# 핵심 개발 원칙

- 항상 TDD 주기를 따르세요: Red → Green → Refactor
- 가장 간단한 실패 테스트를 먼저 작성하세요
- 테스트를 통과하는 데 필요한 최소 코드를 구현합니다.
- 테스트가 통과한 후에만 리팩토링하세요.
- 구조적 변화와 행동적 변화를 분리하여 Beck의 "먼저 정리하기" 접근 방식을 따르세요.
- 개발 전반에 걸쳐 높은 코드 품질 유지

# TDD 방법론 지침

- 작은 기능 증가를 정의하는 실패 테스트를 작성하여 시작하십시오.
- 동작을 설명하는 의미 있는 테스트 이름을 사용하세요(예: "shouldSumTwoPositiveNumbers")
- 테스트 실패를 명확하고 유익하게 만듭니다.
- 테스트를 통과할 만큼의 코드만 작성하세요.
- 테스트가 통과되면 리팩토링이 필요한지 고려하세요.
- 새로운 기능을 위해 주기를 반복합니다.

# 깔끔한 첫 번째 접근 방식

- 모든 변경 사항을 두 가지 유형으로 구분합니다.
  1. 구조적 변경: 동작을 변경하지 않고 코드 재배열(이름 변경, 메서드 추출, 코드 이동)
  2. 동작 변경: 실제 기능 추가 또는 수정
- 동일한 커밋에서 구조적 변경 사항과 동작적 변경 사항을 혼합하지 마십시오.
- 두 가지 모두 필요할 때는 항상 구조적 변경을 먼저 하십시오.
- 구조적 변경이 동작을 변경하지 않는지 확인하려면 변경 전후에 테스트를 실행하세요.

# 규율을 지키세요

- 다음과 같은 경우에만 커밋합니다.
  1. 모든 테스트가 통과되었습니다
  2. 모든 컴파일러/린터 경고가 해결되었습니다.
  3. 변경 사항은 단일 논리적 작업 단위를 나타냅니다.
  4. 커밋 메시지에는 커밋에 구조적 변경 사항이나 동작 변경 사항이 포함되어 있는지 명확하게 명시되어 있습니다.
- 크고 드물게 발생하는 커밋보다는 작고 자주 발생하는 커밋을 사용하세요.

# 코드 품질 표준

- 중복을 무자비하게 제거하세요
- 명명과 구조를 통해 의도를 명확하게 표현합니다.
- 종속성을 명시적으로 만듭니다.
- 방법을 작게 유지하고 단일 책임에 집중하세요.
- 상태 및 부작용 최소화
- 가능한 가장 간단한 솔루션을 사용하세요
- 재사용 코드를 극대화 하세요. 
- 동일 기능은 동일 코드에서 처리 가능하도록 강제하세요. 

# 리팩토링 가이드라인

- 테스트가 통과할 때만 리팩토링합니다("녹색" 단계).
- 적절한 이름을 가진 기존 리팩토링 패턴을 사용합니다.
- 한 번에 하나의 리팩토링 변경을 수행합니다.
- 각 리팩토링 단계 후에 테스트를 실행합니다.
- 중복을 제거하거나 명확성을 개선하는 리팩토링을 우선시합니다.

# 예시 워크플로

새로운 기능에 접근할 때:
1. 기능의 작은 부분에 대한 간단한 실패 테스트를 작성합니다.
2. 통과시키기 위한 최소한의 조치만 시행한다.
3. 테스트를 실행하여 통과 여부를 확인합니다(녹색).
4. 필요한 구조적 변경(먼저 정리)을 하고 각 변경 후 테스트를 실행합니다.
5. 구조적 변경 사항을 별도로 적용하세요
6. 다음 작은 기능 증가에 대한 또 다른 테스트를 추가합니다.
7. 구조적 변경 사항과 별도로 동작 변경 사항을 적용하여 기능이 완료될 때까지 반복합니다.

이 프로세스를 정확하게 따르고, 빠른 구현보다 깔끔하고 잘 테스트된 코드를 항상 우선시하세요.

항상 한 번에 하나의 테스트를 작성하고 실행한 후 구조를 개선하세요. 매번 모든 테스트(장시간 실행되는 테스트 제외)를 실행하세요.

빠른 속도보다 슬로우 씽킹, 딥 마인드에 주목하세요. 

# 타입스트립트 문법에 최적화 

타입 스크립트 에서는 명령형 스타일보다 함수형 프로그래밍 스타일을 선호합니다. 가능하면 if let이나 match를 이용한 패턴 매칭 대신 Option과 Result 조합자(map, and_then, unwrap_or 등)를 사용하세요.

# 현재 개발 운영체제는 window
현재 개발 운영 OS는 윈도우입니다. 파일 생성, 삭제, 이동시 윈도우 명령으로 처리합니다. 

# 시작 인사. 
MD가 적용되었는지를 파악하기 위해 작업 시작시 YES!! SIR!! 라고 외치고 시작합니다. 