// src/app/portal/blog/post/services/postService.ts
import { api } from '@/services/app';

/**
 * Função para buscar todos os posts, incluindo `createdAt` e `updatedAt`.
 * @returns Lista de posts com dados básicos.
 */
export const fetchPosts = async () => {
    const response = await api.get('backblog/post');
    return response.data.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        slug: post.slug,
        published: post.published,
        imagePath: post.imagePath,
        categories: post.categories,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
    }));
};

/**
 * Função para buscar um post específico pelo ID.
 * @param id ID do post a ser buscado.
 * @returns Dados completos do post.
 */
export const fetchPostById = async (id: string) => {
    const response = await fetch(`https://backblog.simpleway.tech/backblog/post/${id}`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar o post com ID ${id}: ${response.status}`);
    }

    const post = await response.json();
    return {
        id: post.id,
        title: post.title,
        content: post.content,
        slug: post.slug,
        published: post.published,
        imagePath: post.imagePath,
        categories: post.categories,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
    };
};

/**
 * Função para buscar posts relacionados de uma mesma categoria, excluindo o post atual.
 * @param categoryId ID da categoria para filtrar posts.
 * @param currentPostId ID do post atual para excluir dos resultados.
 * @returns Lista de posts relacionados limitados a 4 resultados.
 */
export const fetchRelatedPosts = async (categoryIds: string[], currentPostId: string) => {
    try {
        const response = await fetch(`https://backblog.simpleway.tech/backblog/post`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar posts relacionados: ${response.status}`);
        }

        const allPosts = await response.json();

        // Logs para depuração
        console.log("IDs de categorias do post atual:", categoryIds);
        console.log("Todos os posts disponíveis:", allPosts);

        // Filtra os posts relacionados
        const relatedPosts = allPosts.filter((post: any) => 
            post.id !== currentPostId && // Exclui o post atual
            post.categories.some((category: any) => categoryIds.includes(category.id)) // Verifica categorias
        );

        console.log("Posts relacionados encontrados:", relatedPosts);

        return relatedPosts.slice(0, 4); // Limita a 4 posts relacionados
    } catch (error) {
        console.error("Erro ao buscar posts relacionados:", error);
        return [];
    }
};

