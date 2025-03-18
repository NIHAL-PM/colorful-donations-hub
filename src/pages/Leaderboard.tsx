
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import LeaderboardCard from '@/components/LeaderboardCard';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Trophy, AlertCircle, Filter, Search } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Leaderboard = () => {
  const { leaderboard, departmentStats, yearStats, donorTypeStats, isLoading, error } = useLeaderboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Filter donors based on search term and filter type
  const filteredDonors = leaderboard.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'student' && donor.donorType === 'Student') return matchesSearch;
    if (filterType === 'alumni' && donor.donorType === 'Alumni') return matchesSearch;
    if (filterType === 'faculty' && donor.donorType === 'Faculty') return matchesSearch;
    
    return false;
  });

  return (
    <div className="min-h-screen">
      <AnimatedBackground variant="leaderboard" />
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-12 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/dc5f60a7-e574-4624-9179-84afebf69ff9.png" 
              alt="Nilgiri College" 
              className="h-12" 
            />
          </div>
          
          <div className="inline-block rounded-full bg-donation-primary/10 px-4 py-1.5 mb-4">
            <span className="text-sm font-medium text-donation-primary flex items-center">
              <img 
                src="/lovable-uploads/b8adb940-cf0a-4902-89fd-01b317af12a5.png" 
                alt="Happiness Centre" 
                className="h-4 mr-2" 
              />
              <Trophy size={14} className="mr-1" />
              Top Contributors
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-donation-primary to-purple-600">
            Donation Leaderboard
          </h1>
          
          <p className="text-gray-600 max-w-xl mx-auto">
            Recognizing the generous donors of Nilgiri College's Happiness Club. Every contribution makes a difference in our mission.
          </p>
        </motion.div>
        
        <Tabs defaultValue="individuals" className="w-full max-w-3xl mx-auto mb-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="individuals">Individual Donors</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="years">Year-wise</TabsTrigger>
            <TabsTrigger value="types">Donor Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="individuals" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/30 backdrop-blur-md p-4 rounded-xl shadow-sm">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search donors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white/50 border-0 focus-visible:ring-donation-primary"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-44 bg-white/50 border-0">
                  <div className="flex items-center">
                    <Filter size={14} className="mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Donors</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-donation-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading leaderboard data...</p>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500 flex items-center justify-center">
                <AlertCircle className="mr-2" />
                <span>Error loading leaderboard data</span>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDonors.length > 0 ? (
                  filteredDonors.map((donor, index) => (
                    <LeaderboardCard key={donor.id} donor={donor} index={index} />
                  ))
                ) : (
                  <div className="text-center py-10 bg-white/30 backdrop-blur-md rounded-xl">
                    <p className="text-gray-500">No matching donations found. Try adjusting your search.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="departments" className="space-y-4">
            <div className="bg-white/30 backdrop-blur-md p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium mb-4">Department Contributions</h3>
              {departmentStats.length > 0 ? (
                departmentStats.map((dept, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/50 mb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-donation-primary/20 flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{dept.name}</div>
                        <div className="text-xs text-gray-500">
                          {dept.donorCount} {dept.donorCount === 1 ? 'donor' : 'donors'}
                          {dept.previousRank && dept.previousRank > dept.rank && (
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                              +{dept.previousRank - dept.rank}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold">₹{dept.totalAmount.toLocaleString('en-IN')}</div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No department statistics available</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="years" className="space-y-4">
            <div className="bg-white/30 backdrop-blur-md p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium mb-4">Year-wise Contributions</h3>
              {yearStats.length > 0 ? (
                yearStats.map((year, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/50 mb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-donation-primary/20 flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{year.year}</div>
                        <div className="text-xs text-gray-500">
                          {year.donorCount} {year.donorCount === 1 ? 'donor' : 'donors'}
                          {year.previousRank && year.previousRank > year.rank && (
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                              +{year.previousRank - year.rank}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold">₹{year.totalAmount.toLocaleString('en-IN')}</div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No year-wise statistics available</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="types" className="space-y-4">
            <div className="bg-white/30 backdrop-blur-md p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium mb-4">Donor Type Contributions</h3>
              {donorTypeStats.length > 0 ? (
                donorTypeStats.map((type, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/50 mb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-donation-primary/20 flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{type.type}</div>
                        <div className="text-xs text-gray-500">
                          {type.donorCount} {type.donorCount === 1 ? 'donor' : 'donors'}
                          {type.previousRank && type.previousRank > type.rank && (
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                              +{type.previousRank - type.rank}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold">₹{type.totalAmount.toLocaleString('en-IN')}</div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No donor type statistics available</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;
