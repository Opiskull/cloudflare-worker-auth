export const generateStateParam = async (url: string) => {
  const state = await getRandomValue();
  await AUTH_STORE.put(`state-${state}`, url, { expirationTtl: 60 });
  return state;
};

export const hydrateState = (state = {}) => ({
  element: (el: Element) => {
    el.setInnerContent(JSON.stringify(state));
  }
});

export const getRandomValue = async () => {
  const response = await fetch('https://csprng.xyz/v1/api');
  const { Data } = await response.json();
  return Data as string;
};
