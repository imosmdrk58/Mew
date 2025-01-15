// app/logs/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { LogDetailModal } from "./LogModal";

export interface Log {
  log_id: number;
  table_name: string;
  operation_type: string;
  record_id: number;
  old_data: string;
  new_data: string;
  user_id: number;
  created_at: string;
}

const LogsPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  const fetchLogs = async (page: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/logs?limit=${itemsPerPage}`
      );

      console.log(response);

      const data = await response.json();

      console.log(data);

      setLogs(data);
      const dataLength = data.length;

      setTotalPages(Math.ceil(dataLength / itemsPerPage));
    } catch (error) {
      console.error("Loglar yüklenirken hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  const getOperationBadge = (type: string) => {
    const colors = {
      INSERT: "bg-green-100 text-green-800",
      UPDATE: "bg-blue-100 text-blue-800",
      DELETE: "bg-red-100 text-red-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Sistem Logları</h1>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Log ID</TableHead>
                <TableHead>Tablo</TableHead>
                <TableHead>İşlem</TableHead>
                <TableHead>Kayıt ID</TableHead>
                <TableHead>Kullanıcı ID</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Detaylar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.log_id}>
                  <TableCell>{log.log_id}</TableCell>
                  <TableCell className="font-medium">
                    {log.table_name}
                  </TableCell>
                  <TableCell>
                    <Badge className={getOperationBadge(log.operation_type)}>
                      {log.operation_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.record_id}</TableCell>
                  <TableCell>{log.user_id}</TableCell>
                  <TableCell>
                    {format(new Date(log.created_at), "dd.MM.yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedLog(log);
                        setIsOpen(true);
                      }}
                    >
                      Detayları Gör
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "disabled-class" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-4">
                  Sayfa {currentPage} / {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  style={{
                    pointerEvents: currentPage === totalPages ? "none" : "auto",
                    opacity: currentPage === totalPages ? 0.5 : 1,
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <LogDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        log={selectedLog}
      />
    </>
  );
};

export default LogsPage;
