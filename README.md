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

| 메트릭 | 설명                     | 측정값 | 상태 |
| ------ | ------------------------ | ------ | ---- |
| LCP    | Largest Contentful Paint | 13.73s | 🔴   |

#### 2-1-2. 개선 후 성능

##### 🎯 Lighthouse 점수

| 카테고리       | 점수 | 상태 |
| -------------- | ---- | ---- |
| Performance    | 94%  | 🟢   |
| Accessibility  | 95%  | 🟢   |
| Best Practices | 75%  | 🟠   |
| SEO            | 100% | 🟢   |

##### 📊 Core Web Vitals (2024)

| 메트릭 | 설명                     | 측정값 | 상태 |
| ------ | ------------------------ | ------ | ---- |
| LCP    | Largest Contentful Paint | 2.48s  | 🟢   |

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

### 2-2. Core Web Vitals - LCP 개선 사항

#### 2-2-1. 이미지 최적화

- 이미지 포맷을 JPG, PNG 에서 AVIF 로 변경하여 압축률 개선

```js
const img = document.createElement('img');
img.fetchPriority = 'low';
```

- 제품 이미지의 `fetchPriority` 속성을 `low`로 설정하여 로딩 우선 순위 조정

```html
<picture>
  <source class="mobile" media="(max-width: 576px)" srcset="images/Hero_Mobile.avif" />
  <source class="tablet" media="(max-width: 960px)" srcset="images/Hero_Tablet.avif" />
  <img
    class="desktop"
    src="images/Hero_Desktop.avif"
    alt="Immersive VR headset experience showcasing virtual reality technology"
    width="960"
    height="560"
    loading="eager"
  />
</picture>
```

- 반응형 이미지 처리를 위한 `picture` 태그 적용

#### 2-2-2. 리소스 로딩 최적화

```html
<link rel="preload" href="https://fonts.googleapis.com/css?family=Heebo:300,400,600,700&display=swap" as="style" />
<link rel="preload" href="/css/styles.css" as="style" />
```

- `preload` 속성 적용

```js
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadProducts();
        observer.disconnect();
      }
    });
  },
  {
    rootMargin: '100px',
  },
);
```

- IntersectionObserver 를 통한 지연 로딩 구현

#### 2-2-3. 데이터 처리 최적화

```js
let cachedProducts = null;

async function loadProducts() {
  try {
    if (cachedProducts) {
      displayProducts(cachedProducts);
      return;
    }

    const response = await fetch('https://fakestoreapi.com/products', {
      cache: 'force-cache',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error();
    }

    const products = await response.json();
    cachedProducts = products;
    displayProducts(products);
  } catch (error) {
    console.error(error);

    const container = document.querySelector('#all-products .container');
    if (container) {
      container.innerHTML =
        '<p class="error" role="alert">상품을 불러오는데 실패했습니다. 나중에 다시 시도해주세요.</p>';
    }
  }
}
```

- 제품 API 호출에 캐시를 적용하여 반복 요청 최소화
