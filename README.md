# Chapter 4-2. 코드 관점의 성능 최적화

## 1. 배포 링크

https://front-5th-chapter4-2-basic-nine.vercel.app

## 2. 성능 개선 사항

### 2-1. 성능 측정 결과

#### 2-1-1. 개선 전 성능

##### 🎯 Lighthouse 점수

| 카테고리       | 점수 | 상태 |
| -------------- | ---- | ---- |
| Performance    | 72%  | 🟠   |
| Accessibility  | 82%  | 🟠   |
| Best Practices | 71%  | 🟠   |
| SEO            | 82%  | 🟠   |

##### 📊 Core Web Vitals (2024)

| 메트릭 | 설명                      | 측정값 | 상태 |
| ------ | ------------------------- | ------ | ---- |
| LCP    | Largest Contentful Paint  | 13.73s | 🔴   |

#### 2-1-2. 개선 후 성능

##### 🎯 Lighthouse 점수

| 카테고리       | 점수 | 상태 |
| -------------- | ---- | ---- |
| Performance    | 94%  | 🟢   |
| Accessibility  | 95%  | 🟢   |
| Best Practices | 75%  | 🟠   |
| SEO            | 100% | 🟢   |

##### 📊 Core Web Vitals (2024)

| 메트릭 | 설명                      | 측정값 | 상태 |
| ------ | ------------------------- | ------ | ---- |
| LCP    | Largest Contentful Paint  | 2.48s  | 🟢   |

#### 2-1-3. 성능 개선 수치

##### 🎯 Lighthouse 점수 개선

| 카테고리       | 개선 전 | 개선 후 | 개선률 |
| -------------- | ------- | ------- | ------ |
| Performance    | 72%     | 94%     | +22%   |
| Accessibility  | 82%     | 95%     | +13%   |
| Best Practices | 71%     | 75%     | +4%    |
| SEO            | 82%     | 100%    | +18%   |

##### 📊 Core Web Vitals 개선

| 메트릭 | 개선 전 | 개선 후 | 개선률 |
| ------ | ------- | ------- | ------ |
| LCP    | 13.73s  | 2.48s   | -81.9% |
