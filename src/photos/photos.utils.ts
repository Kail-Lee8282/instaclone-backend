/**
 * Hashtag split
 * @param caption
 * @returns
 *
 */
export const processHashtags: any = (caption) => {
  const hashtag =
    (caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g) as [String]) || [];
  return hashtag.map((hashtag) => ({
    where: {
      hashtag,
    },
    create: {
      hashtag,
    },
  }));
};
