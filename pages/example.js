import { gql, useQuery } from '@apollo/client';
import { NavigationMenu } from 'components';
import { getNextStaticProps , getApolloClient } from '@faustwp/core';

import { BlogInfoFragment } from '../fragments/GeneralSettings';
import * as MENUS from '../constants/menus';

export default function Page(props) {
    console.log(props.post.page.content);
  const { data } = useQuery(Page.query, {
    variables: Page.variables(),
  });
  console.debug(data);
  return <></>;
}

Page.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetPageData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
    generalSettings {
      ...BlogInfoFragment
    }
    headerMenuItems: menuItems(where: { location: $headerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`;

Page.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  };
};

export async function getStaticProps(ctx) {
    const apolloclient = getApolloClient();
    const { data } = await apolloclient.query({
      query: gql`
        query GetPage($slug: ID!) {
          page(id: $slug, idType: URI) {
            id
            slug
            content
          }
        }
      `,
      variables: {
        slug: 'brand-guide',
      },
    });
    if (!data?.page.id)
      return {
        notFound: true,
      };
    return getNextStaticProps(ctx, {
      Page,
      props: {
        post: data,
        navType: 'internal',
      },
      revalidate: 1,
    });
  }
  
