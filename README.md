# Chapter 4-2. 코드 관점의 성능 최적화

## 1. 배포 링크

https://front-5th-chapter4-2-basic-nine.vercel.app

## 2. 성능 개선 사항

### 2-1. 성능 측정 결과

> [최종 성능 측정 결과 링크](https://github.com/mnxmnz/front_5th_chapter4-2_basic/issues/17)

| 카테고리       | 개선 전 | 개선 후 | 개선률 |
| -------------- | ------- | ------- | ------ |
| Performance    | 72%     | 94%     | +22%   |
| Accessibility  | 82%     | 95%     | +13%   |
| Best Practices | 71%     | 75%     | +4%    |
| SEO            | 82%     | 100%    | +18%   |
| LCP            | 13.73s  | 2.48s   | +81.9% |

### 2-2. LCP 개선 사항

#### 2-2-1. 이미지 포맷 변경

이미지 포맷을 JPG, PNG 에서 AVIF 로 변경하여 압축률을 개선했습니다.

#### 2-2-2. `picture` 태그 적용

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

반응형 이미지 대응을 위해 `picture` 태그를 적용했습니다.

#### 2-2-3. `preload` 속성 적용

```html
<link rel="preload" href="https://fonts.googleapis.com/css?family=Heebo:300,400,600,700&display=swap" as="style" />
<link rel="preload" href="/css/styles.css" as="style" />
```

`preload` 속성을 적용하여 페이지 초기 렌더링 속도를 개선했습니다.

#### 2-2-4. 지연 로딩 구현

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

`IntersectionObserver` 를 통한 지연 로딩 구현으로 초기 페이지 로딩 시 필요한 리소스만 먼저 가져왔습니다.

#### 2-2-5. 캐시 적용

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

제품 API 호출에 캐시를 적용하여 반복 요청을 최소화했습니다.

### 2-3. Accessibility 개선 사항

#### 2-3-1. ARIA 레이블 적용

```html
<a href="index.html" aria-label="VR Headsets Shop Home">
  <button aria-label="Open menu" aria-expanded="false">
    <form aria-label="Newsletter subscription form"></form></button
></a>
```

ARIA 레이블을 추가하여 스크린 리더 사용자들이 각 요소의 목적을 이해할 수 있도록 했습니다.

#### 2-3-2. 이미지 alt 텍스트 개선

```html
<img
  src="images/Hero_Desktop.avif"
  alt="Immersive VR headset experience showcasing virtual reality technology"
  width="960"
  height="560"
  loading="eager"
/>
```

모든 이미지에 alt 텍스트를 추가하여 이미지의 내용을 이해할 수 있도록 했습니다.

#### 2-3-3. 제품 카드 접근성 개선

```js
productElement.setAttribute('role', 'article');
button.setAttribute('aria-label', `Add ${product.title} to shopping bag`);
```

동적으로 생성되는 제품 카드에 적절한 ARIA 역할과 레이블을 추가했습니다.

### 2-4. SEO 개선 사항

#### 2-4-1. 메타 태그 추가

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta
  name="description"
  content="Discover our premium collection of VR headsets. Shop the latest virtual reality technology from top brands."
/>
<meta name="keywords" content="VR headsets, virtual reality, gaming, technology" />
<meta name="author" content="VR Headsets Shop" />
<meta name="robots" content="index, follow" />
<meta property="og:title" content="VR Headsets Shop - Premium Virtual Reality Technology" />
<meta
  property="og:description"
  content="Discover our premium collection of VR headsets. Shop the latest virtual reality technology from top brands."
/>
<meta property="og:type" content="website" />
<meta property="og:url" content="https://vrheadsets.shop" />
```

HTML 파일에 메타 태그를 추가했습니다.

## 3. 트러블 슈팅 과정

### 3-1. 이미지 포맷 변경 과정

초기 성능 측정에서 LCP 지수가 가장 낮게 나와 이를 먼저 개선했습니다. 이미지를 사내에서 사용 중인 WebP 포맷으로 변경한 후 코드 최적화를 통한 개선을 시도했습니다. 다만 여러 시도를 해도 목표로 했던 2.5초 이하의 LCP 지수를 달성하지 못했습니다. 이후 AVIF 포맷으로 변경하고 예상보다 큰 개선 효과를 얻을 수 있었습니다.

#### 3-1-1. WebP vs AVIF 비교

| 항목          | WebP | AVIF      |
| ------------- | ---- | --------- |
| 압축률        | 중간 | 매우 높음 |
| 브라우저 지원 | 넓음 | 제한적    |
| 파일 크기     | 중간 | 매우 작음 |
| 품질 손실     | 적음 | 매우 적음 |
| 인코딩 시간   | 빠름 | 느림      |
| 디코딩 시간   | 빠름 | 느림      |

AVIF 는 WebP 보다 높은 압축률을 제공해서 LCP 지수를 크게 개선할 수 있었습니다. 다만 브라우저 지원이 제한적이라는 단점이 있어서 `picture` 태그를 사용하여 fallback 이미지를 적용했습니다.

#### 3-1-2. 이미지 포맷 관련 질문 사항

멘토님에게 이미지 포맷 관련하여 여쭤보고 싶은 점이 있습니다!

해당 과제에서는 성능 지수 개선이 최우선이라고 생각하여 AVIF 포맷에 단점이 있어도 우선 해당 포맷으로 변경하였습니다. 그런데 브라우저 지원이 제한적이어서 실무에서 많이 사용하는지 궁금합니다! 이러한 이미지 포맷에 대한 의사 결정은 서비스 성격에 따라 달라지는 걸까요? 🤔
