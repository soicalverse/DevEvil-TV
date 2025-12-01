
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ media, mediaType }) => {
  const isMovie = mediaType === 'movie';
  const title = media.title || media.name;
  const release_year = new Date(media.release_date || media.first_air_date).getFullYear();
  const canonical_url = window.location.href;

  const streaming_servers = [
      { name: 'VIDEASY', embed_url: `https://player.videasy.net/${isMovie ? 'movie' : 'tv'}/${media.id}` },
      { name: 'VidLink', embed_url: `https://vidlink.pro/${isMovie ? 'movie' : 'tv'}/${media.id}` },
      { name: 'VidFast', embed_url: `https://vidfast.pro/${isMovie ? 'movie' : 'tv'}/${media.id}` },
      { name: 'MoviesAPI', embed_url: `https://moviesapi.club/${isMovie ? 'movie' : 'tv'}/${media.id}` },
      { name: 'SuperEmbed', embed_url: `https://superembed.stream/${isMovie ? 'movie' : 'tv'}/${media.id}` },
  ];

  const movieSchema = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    '@id': `${canonical_url}#movie`,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': canonical_url,
    },
    'url': canonical_url,
    'name': `${title} (${release_year})`,
    'image': [
        `https://image.tmdb.org/t/p/w1280${media.poster_path}`,
        `https://image.tmdb.org/t/p/original${media.backdrop_path}`
    ],
    'description': media.overview,
    'datePublished': media.release_date,
    'genre': media.genres.map(g => g.name),
    'duration': `PT${media.runtime}M`,
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': media.vote_average,
      'bestRating': '10',
      'worstRating': '0',
      'ratingCount': media.vote_count,
    },
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
      'url': canonical_url,
      'availability': 'https://schema.org/InStock',
    },
    'potentialAction': {
      '@type': 'WatchAction',
      'target': streaming_servers.map(server => ({
        '@type': 'EntryPoint',
        'urlTemplate': server.embed_url,
        'name': `Watch on ${server.name}`,
        'actionPlatform': [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ]
      })),
    },
    'sameAs': [
      `https://www.themoviedb.org/movie/${media.id}`,
      `https://www.imdb.com/title/${media.imdb_id}`
    ]
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://filmfind.online',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': isMovie ? 'Movies' : 'TV Shows',
        'item': `https://filmfind.online/${isMovie ? 'movies' : 'tvshows'}`,
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': title,
        'item': canonical_url,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': `Where can I watch ${title} free online?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `You can watch ${title} for free on Filmfind with 7 different streaming servers in HD and Full HD.`,
        },
      },
      {
        '@type': 'Question',
        'name': `Is ${title} available on Netflix?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Not in all regions. Filmfind offers it free worldwide with no login.',
        },
      },
      {
        '@type': 'Question',
        'name': `Does ${title} have subtitles?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes — auto subtitles in 50+ languages available on all servers.',
        },
      },
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': `How to Watch ${title} Free on Filmfind`,
    'step': [
      {
        '@type': 'HowToStep',
        'text': `Go to Filmfind.online and search '${title}'`,
      },
      {
        '@type': 'HowToStep',
        'text': 'Choose your preferred server (7 options)',
      },
      {
        '@type': 'HowToStep',
        'text': 'Press play — no sign-up, no ads',
      },
    ],
  };

  return (
    <Helmet>
      <title>{`${title} (${release_year}) - Watch Free on Filmfind`}</title>
      <link rel="canonical" href={canonical_url} />
      <meta name="description" content={`Watch ${title} free in HD on Filmfind — 7 streaming servers, no sign-up, no ads.`} />

      {/* Open Graph */}
      <meta property="og:title" content={`${title} (${release_year}) - Watch Free Online | Filmfind`} />
      <meta property="og:description" content={`Watch ${title} free in HD on Filmfind — 7 streaming servers, no sign-up, no ads.`} />
      <meta property="og:image" content={`https://image.tmdb.org/t/p/w1200${media.poster_path}`} />
      <meta property="og:url" content={canonical_url} />
      <meta property="og:type" content="video.movie" />
      <meta property="og:site_name" content="Filmfind" />
      <meta property="og:video" content={streaming_servers[0].embed_url} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="player" />
      <meta name="twitter:site" content="@filmfind" />
      <meta name="twitter:title" content={`${title} - Free Full Movie`} />
      <meta name="twitter:description" content="7 servers • HD • No registration" />
      <meta name="twitter:image" content={`https://image.tmdb.org/t/p/w1200${media.poster_path}`} />
      <meta name="twitter:player" content={streaming_servers[0].embed_url} />
      <meta name="twitter:player:width" content="1280" />
      <meta name="twitter:player:height" content="720" />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">{JSON.stringify(movieSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
    </Helmet>
  );
};

export default SEO;
