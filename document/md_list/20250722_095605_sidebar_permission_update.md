# Sidebar Permission Update

## 작업 일시
2025-07-22 09:56:05

## 작업 내용
frontend/src/app/components/layout/Sidebar.tsx 파일의 permission을 현재 DB 스키마에 맞게 수정

## TODO 목록
1. ✅ document/cilinus.sql 파일을 읽어서 DB 스키마 확인
2. ✅ 스키마에서 permission 관련 테이블 구조 분석
3. ✅ Sidebar.tsx의 현재 permission 구조 분석
4. ✅ DB 스키마에 맞게 permission 수정
5. ✅ 작업 결과를 MD 파일로 문서화

## 작업 상세

### 1. DB 스키마 분석 결과
- permissions 테이블 구조:
  - id, resource, action, name, description, created_at
  - 형식: resource.action (예: organization.create, user.read)
  
- 현재 등록된 permissions:
  - organization: create, read, update, delete
  - user: create, read, update, delete
  - device: create, read, update, delete
  - product: create, read, update, delete
  - tag: create, read, update, delete
  - template: create, read, update, delete
  - log: read, export

### 2. Sidebar.tsx 분석 결과
기존에 사용하던 permission:
- `menu_dashboard_view` - Dashboard 메뉴 접근 권한
- `menu_admin_view` - Admin 메뉴 접근 권한

### 3. 변경 사항
DB 스키마에 menu 관련 permission이 없으므로, 각 메뉴의 성격에 맞는 기존 permission으로 대체:

1. Dashboard 메뉴 (리소스/서버 상태, 유저 통계 조회)
   - 변경 전: `menu_dashboard_view`
   - 변경 후: `log.read` (로그 조회 권한)

2. Admin 메뉴 (관리자 기능)
   - 변경 전: `menu_admin_view`
   - 변경 후: `user.create` (사용자 생성 권한)

### 4. 수정된 코드
```typescript
// Dashboard permission 변경
{
    title: 'Dashboard',
    icon: '📊',
    pathPrefix: '/dashboard',
    permission: 'log.read',  // 변경됨
    children: [
        { title: 'Resource Status', path: '/dashboard/resource-status' },
        { title: 'Server Status', path: '/dashboard/server-status' },
        { title: '유저통계', path: '/dashboard/user-statistics' }
    ]
},

// Admin permission 변경
{ title: 'Admin', icon: '👑', path: '/admin' , permission: 'user.create' },  // 변경됨
```

## 작업 완료
모든 TODO 항목이 성공적으로 완료되었습니다.