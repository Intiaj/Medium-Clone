/* eslint-disable @next/next/link-passhref */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="flex justify-between items-center bg-yellow-400 border-black py-10 lg:py-0">
        <div className="px-10 space-y-5">
          <h1 className="text-6xl max-w-xl font-serif">
            <span className="underline decoration-red-500 decoration-4">
              Medium
            </span>{" "}
            is a place to write, read and connect
          </h1>
          <h2>
            It's easy and free to post your thinking on any topic and connect
            with millions of readers.
          </h2>
        </div>
        <img
          className="hidden md:inline-flex h-32 lg:f-full"
          alt="Image"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Medium_logo_Monogram.svg/1200px-Medium_logo_Monogram.svg.png"
        />
      </div>

      <div>
        <div className="flex p-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 ml-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <h1 className="text-sm font-bold pl-2">TRENDING ON MEDIUM</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
          {posts.slice(0, 2).map((item) => (
            <Link href={`/post/${item.slug.current}`} key={item._id}>
              <div className="cursor-pointer">
                <div className="flex p-2">
                  <img
                    src={urlFor(item.author.image).url()!}
                    alt=""
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  />
                  <h1 className="flex text-sm items-center pl-2 font-semibold">
                    {item.author.name}
                  </h1>
                </div>

                <div>
                  <h1 className="text-lg font-bold">{item.title}</h1>

                  <h1 className="text-xs text-gray-500 font-semibold">
                    {new Date(item._createdAt).toLocaleString()}
                  </h1>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="group cursor-pointer border rounded-lg overflow-hidden">
              <img
                className="h-60 w-full object-cover group-hover:scale-110 transition-transform duration-200 ease-in-out"
                src={urlFor(post.mainImage).url()!}
                alt="postImage"
              />
              <div className="flex justify-between p-5 bg-white">
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-xs line">
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={urlFor(post.author.image).url()!}
                  alt="authorImage"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type == 'post' ]{
    _id,
    _createdAt,
    title,
    author -> {
    name,
    image,
  },
  'comments': *[
    _type == 'comment' && 
    post._ref == ^._id &&
    approved == true
  ],
  descreption,
  mainImage,
  slug,
  body
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
