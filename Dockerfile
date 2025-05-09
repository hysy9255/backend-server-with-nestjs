# 1. Node.js 베이스 이미지 사용
FROM node:20-alpine

# 2. 앱 디렉토리 만들고 작업 디렉토리로 이동
WORKDIR /app

# 3. package.json 복사하고 의존성 설치
COPY package*.json ./
RUN npm install

# 4. 소스 코드 복사
COPY . .

# 5. 빌드 (NestJS는 ts → js 트랜스파일 필요)
RUN npm run build

# 6. 앱 실행
CMD ["node", "dist/main.js"]

# 7. (필요 시 포트 열기)
EXPOSE 3002
