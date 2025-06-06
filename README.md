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

#### 2-2-1. 이미지 최적화

##### 이미지 포맷 변경

이미지 포맷을 JPG, PNG 에서 AVIF 로 변경하여 압축률을 개선했습니다.

##### fetchPriority 속성 설정

```js
const img = document.createElement('img');
img.fetchPriority = 'low';
```

제품 이미지의 `fetchPriority` 속성을 `low` 로 설정하여 로딩 우선 순위를 조정했습니다.

##### `picture` 태그 적용

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

#### 2-2-2. 리소스 로딩 최적화

##### `preload` 속성 적용

```html
<link rel="preload" href="https://fonts.googleapis.com/css?family=Heebo:300,400,600,700&display=swap" as="style" />
<link rel="preload" href="/css/styles.css" as="style" />
```

`preload` 속성을 적용하여 페이지 초기 렌더링 속도를 개선했습니다.

##### 지연 로딩 구현

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

IntersectionObserver 를 통한 지연 로딩 구현으로 초기 페이지 로딩 시 필요한 리소스만 먼저 가져왔습니다.

#### 2-2-3. 데이터 처리 최적화

##### 캐시 적용

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
