import { PrismaClient, Achievement } from '@prisma/client';

const prisma = new PrismaClient();

export async function generate_achievements() {
    const achievementData: Array<{ title: string; desc: string; icon: string }> = [
        {
          title: "Beginner's Luck",
          desc: "win five games in a row",
          icon: "beginnersluck.jpeg",
        },
        {
          title: "The One Above All",
          desc: "reach the number one rank",
          icon: "oneaboveall.jpeg",
        },
        {
          title: "Skill Gap",
          desc: "win a game against a player 20 rank higher than yours",
          icon: "skillgap.jpeg",
        },
        {
          title: "The Collectioner",
          desc: "buy all available Chromas",
          icon: "collectioner.jpeg",
        },
      ];
  
      // Create the achievements in the database
      const createdAchievements = await Promise.all(
        achievementData.map(async (achievement) => {
          return prisma.achievement.create({
            data: achievement,
          });
        })
      );
};
