import React from 'react';
import LessonDetailScreen from './LessonDetailScreen';

// ArticleDetailScreen is identical to LessonDetailScreen in functionality
// We can reuse the component but export it as ArticleDetailScreen for navigation clarity
export default function ArticleDetailScreen(props: any) {
    // Map 'article' param to 'lesson' param if needed, but our data structure is unified now
    const { article } = props.route.params;
    if (article) {
        props.route.params.lesson = article;
    }
    return <LessonDetailScreen {...props} />;
}
