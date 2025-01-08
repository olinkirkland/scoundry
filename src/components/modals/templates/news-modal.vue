<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader close-button>
                <h3>
                    {{ $t('User-interface.Modals.News-and-updates.title') }}
                </h3>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <section class="news">
                <ul v-if="newsItems.length">
                    <li
                        class="news-item"
                        v-for="newsItem in newsItems"
                        :key="newsItem.id"
                    >
                        <div class="news-item__title">
                            <h2>{{ newsItem?.title }}</h2>
                            <h2>{{ newsItem?.date }}</h2>
                        </div>
                        <div
                            class="news-item__content"
                            v-html="newsItem?.content"
                        ></div>
                    </li>
                </ul>
                <div class="preview-container" v-else>
                    <img
                        class="spinner"
                        src="/assets/icons/loading.png"
                        alt="Loading"
                    />
                    <img ref="sheetPreview" class="preview" />
                </div>
            </section>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import { ref } from 'vue';

type NewsItem = {
    id: string;
    title: string;
    date: string;
    content: string;
};

// Get news.json from /assets/news.json
// Use a fetch request to get the news items
const newsItems = ref([] as NewsItem[]);
fetch('/assets/news.json?_t=' + Date.now())
    .then((response) => response.json())
    .then((data) => {
        newsItems.value = data;
        localStorage.setItem('lastNewsIdSeen', data[0].id);
    });
</script>

<style scoped lang="scss">
.news {
    min-width: 64rem;
    max-width: 64rem;
    display: flex;
    flex-direction: column;
}

.preview-container {
    width: 100%;
    min-height: 8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > img.spinner {
        animation: spin 1s linear infinite;
    }

    > img.preview {
        width: 100%;
    }
}

.news-item {
    > .news-item__title {
        padding-bottom: 0.4rem;
        margin-bottom: 1.6rem;
        border-bottom: 0.4rem solid var(--color-primary);
        display: flex;
        justify-content: space-between;
    }

    > :deep(.news-item__content) {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;

        * {
            line-height: 1.6;
        }

        h3 {
            display: inline-block;
            text-transform: uppercase;
            font-size: 1rem;
            letter-spacing: 0.2rem;
            border-bottom: 0.4rem solid var(--color-surface-lighter);
            padding-bottom: 0.4rem;
            margin-bottom: 0.8rem;
        }

        section {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            padding: 1.2rem;
        }

        section > ul {
            padding: 0.8rem;
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
            > li::before {
                content: '❖';
                margin-right: 0.4rem;
            }

            ul {
                margin-left: 2rem;
                display: flex;
                flex-direction: column;
                margin-top: 0.2rem;
                gap: 0.2rem;

                > li::before {
                    content: '◇';
                    margin-right: 0.4rem;
                }
            }
        }
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .news {
        min-width: 100%;
        max-width: 100%;
    }

    .news-item > .news-item__title {
        flex-direction: column;
        align-items: center;

        > h2:nth-child(2) {
            opacity: 0.4;
            font-size: 1rem;
        }
    }
}
</style>
