import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}
  //
  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;

    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const idNum = parseInt(id);
    const report = await this.repo.findOne({
      where: {
        id: idNum,
      },
    });
    if (!report) {
      throw new NotFoundException('report not fond');
    }

    report.approved = approved;
    return this.repo.save(report);
  }

  //   createEstimate(estimateDto: GetEstimateDto) {
  //     return this.repo
  //       .createQueryBuilder()
  //       .select('*')
  //       .where('make = :make', { make: estimateDto.make })
  //       .getRawMany();
  //   }
  createEstimate(estimateDto: GetEstimateDto) {
    return (
      this.repo
        .createQueryBuilder()
        // .select('*')
        .select('AVG(price)', 'price')
        .where('make = :make', { make: estimateDto.make })
        .andWhere('model = :model', { model: estimateDto.model })
        .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: estimateDto.lng })
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: estimateDto.lat })
        .andWhere('year - :year  BETWEEN -3 AND 3', { year: estimateDto.year })
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        .setParameters({ mileage: estimateDto.mileage })
        .limit(3)
        .getRawMany()
    );
  }
}
