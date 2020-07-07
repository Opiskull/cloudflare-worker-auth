export const generateStateParam = async () => {
  const resp = await fetch('https://csprng.xyz/v1/api');
  const { Data: state } = await resp.json();
  await AUTH_STORE.put(`state-${state}`, 'true', { expirationTtl: 60 });
  return state;
};

export const hydrateState = (state = {}) => ({
  element: (el: Element) => {
    el.setInnerContent(JSON.stringify(state));
  }
});
