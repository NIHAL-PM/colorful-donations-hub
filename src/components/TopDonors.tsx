
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, TrendingUp, Users, BookOpen, GraduationCap } from 'lucide-react';

const TopDonors: React.FC = () => {
  const { leaderboard, departmentStats, yearStats, donorTypeStats } = useLeaderboard();
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Donation Stats</CardTitle>
        <CardDescription>Leaderboard of top contributors</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="donors" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="donors" className="text-xs sm:text-sm">
              <Users className="h-3 w-3 mr-1 hidden sm:inline" />
              Top Donors
            </TabsTrigger>
            <TabsTrigger value="departments" className="text-xs sm:text-sm">
              <BookOpen className="h-3 w-3 mr-1 hidden sm:inline" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="years" className="text-xs sm:text-sm">
              <GraduationCap className="h-3 w-3 mr-1 hidden sm:inline" />
              Years
            </TabsTrigger>
            <TabsTrigger value="donorTypes" className="text-xs sm:text-sm">
              <Users className="h-3 w-3 mr-1 hidden sm:inline" />
              Donor Types
            </TabsTrigger>
          </TabsList>

          <TabsContent value="donors" className="space-y-2 mt-2">
            {leaderboard.slice(0, 5).map((donor, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-donation-purple/20 flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{donor.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <span>{new Date(donor.date).toLocaleDateString()}</span>
                      {donor.department && (
                        <>
                          <span className="inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="text-donation-primary/80">{donor.department}</span>
                        </>
                      )}
                      {donor.year && (
                        <>
                          <span className="inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="text-donation-primary/80">{donor.year}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="font-bold">₹{donor.amount.toLocaleString('en-IN')}</div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="departments" className="space-y-2 mt-2">
            {departmentStats.slice(0, 5).map((dept, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-donation-purple/20 flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{dept.name}</div>
                    <div className="text-xs text-gray-500">
                      {dept.donorCount} {dept.donorCount === 1 ? 'donor' : 'donors'}
                      {dept.previousRank && dept.previousRank > dept.rank && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          <span className="text-xs">
                            {dept.previousRank - dept.rank}
                          </span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="font-bold">₹{dept.totalAmount.toLocaleString('en-IN')}</div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="years" className="space-y-2 mt-2">
            {yearStats.slice(0, 5).map((year, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-donation-purple/20 flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{year.year}</div>
                    <div className="text-xs text-gray-500">
                      {year.donorCount} {year.donorCount === 1 ? 'donor' : 'donors'}
                      {year.previousRank && year.previousRank > year.rank && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span className="text-xs">
                            {year.previousRank - year.rank}
                          </span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="font-bold">₹{year.totalAmount.toLocaleString('en-IN')}</div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="donorTypes" className="space-y-2 mt-2">
            {donorTypeStats.slice(0, 5).map((type, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-donation-purple/20 flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{type.type}</div>
                    <div className="text-xs text-gray-500">
                      {type.donorCount} {type.donorCount === 1 ? 'donor' : 'donors'}
                      {type.previousRank && type.previousRank > type.rank && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          <span className="text-xs">
                            {type.previousRank - type.rank}
                          </span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="font-bold">₹{type.totalAmount.toLocaleString('en-IN')}</div>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TopDonors;
